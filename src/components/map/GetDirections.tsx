import React, { useState, useEffect } from "react";
import { Source, Layer, useMap, Marker } from "react-map-gl";
import { useTheme } from "@mui/material/styles";
import { MapPin, PersonStanding} from "lucide-react";
import type { Feature, LineString } from "geojson";
import DirectionsHeader from "./DirectionsHeader";
import DirectionsPanel from "./DirectionsPanel";
import DirectionsContainer from "./DirectionsContainer";

interface GetDirectionsProps {
  destination: {
    longitude: number;
    latitude: number;
  };
  onClose?: () => void;
}

interface RouteFeature extends Feature {
  geometry: LineString;
  properties: {};
}

interface DirectionStep {
  maneuver: {
    instruction: string;
    type: string;
    location: [number, number];
  };
  distance: number;
  duration: number;
}

const GetDirections: React.FC<GetDirectionsProps> = ({
  destination,
  onClose,
}) => {
  const theme = useTheme();
  const { current: map } = useMap();
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [steps, setSteps] = useState<DirectionStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeStartEnd, setRouteStartEnd] = useState<{
    start: [number, number] | null;
    end: [number, number] | null;
  }>({ start: null, end: null });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError(
          "Could not get your location. Please enable location services."
        );
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fitRouteInView = (
    routeGeometry: LineString,
    padding = { top: 50, bottom: window.innerHeight * 0.33, left: 50, right: 50 }
  ) => {
    if (!map) return;
    const coordinates = routeGeometry.coordinates;
    const bounds = coordinates.reduce(
      (box, coord) => ({
        minLng: Math.min(box.minLng, coord[0]),
        maxLng: Math.max(box.maxLng, coord[0]),
        minLat: Math.min(box.minLat, coord[1]),
        maxLat: Math.max(box.maxLat, coord[1]),
      }),
      {
        minLng: Infinity,
        maxLng: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity,
      }
    );

    const lngPadding = (bounds.maxLng - bounds.minLng) * 0.1;
    const latPadding = (bounds.maxLat - bounds.minLat) * 0.1;

    map.fitBounds(
      [
        [bounds.minLng - lngPadding, bounds.minLat - latPadding],
        [bounds.maxLng + lngPadding, bounds.maxLat + latPadding],
      ],
      {
        padding,
        duration: 1000,
      }
    );
  };

  const focusOnStep = (stepIndex: number) => {
    if (!map || !steps[stepIndex]) return;

    const stepLocation = steps[stepIndex].maneuver.location;
    map.flyTo({
      center: [stepLocation[0], stepLocation[1]],
      duration: 1000,
    });
  };

  useEffect(() => {
    const getDirections = async () => {
      if (!userLocation) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
            `${userLocation.longitude},${userLocation.latitude};` +
            `${destination.longitude},${destination.latitude}` +
            `?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        );

        if (!response.ok) throw new Error("Failed to fetch directions");

        const data = await response.json();

        if (!data.routes || !data.routes[0]) {
          throw new Error("No route found");
        }

        const routeGeoJSON: RouteFeature = {
          type: "Feature",
          properties: {},
          geometry: data.routes[0].geometry,
        };

        // Extract the first and last coordinates of the route
        const coordinates = routeGeoJSON.geometry.coordinates;
         setRouteStartEnd({
           start: coordinates[0] as [number, number],
           end: coordinates[coordinates.length - 1] as [number, number]
         });


        setRoute(routeGeoJSON);
        setSteps(data.routes[0].legs[0].steps);
        fitRouteInView(data.routes[0].geometry);
      } catch (error) {
        setError("Could not calculate directions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      getDirections();
    }
  }, [userLocation, destination]);

  const handleStepChange = (newIndex: number) => {
    setCurrentStepIndex(newIndex);
    focusOnStep(newIndex);
  };

  return (
    <>
      <DirectionsContainer>
        <DirectionsHeader onClose={onClose} />
        <DirectionsPanel
          loading={loading}
          error={error}
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepChange={handleStepChange}
        />
      </DirectionsContainer>

      {route && routeStartEnd.start && routeStartEnd.end && (
        <>
          <Source type="geojson" data={route}>
            <Layer
              id="route"
              type="line"
              paint={{
                "line-color": theme.palette.primary.main,
                "line-width": 4,
                "line-opacity": 0.8,
              }}
            />
          </Source>

          {/* Start marker */}
          <Marker
            longitude={routeStartEnd.start[0]}
            latitude={routeStartEnd.start[1]}
            anchor="bottom"
          >
            <PersonStanding size={26} className="text-blue-500" />
          </Marker>

          {/* Destination marker */}
          <Marker
            longitude={routeStartEnd.end[0]}
            latitude={routeStartEnd.end[1]}
            anchor="bottom"
          >
            <MapPin size={26} className="text-red-500" />
          </Marker>
        </>
      )}
    </>
  );
};

export default GetDirections;
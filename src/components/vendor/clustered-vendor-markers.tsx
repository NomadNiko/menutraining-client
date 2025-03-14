import { useMemo } from "react";
import { Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";
import Chip from "@mui/material/Chip";
import { Binoculars, GraduationCap, Timer, Ticket, Users } from "lucide-react";
import { Vendor, VendorTypes } from "@/app/[language]/types/vendor";
import { BBox, Feature, Point, GeoJsonProperties } from "geojson";

export interface ClusteredVendorMarkersProps {
  vendors: Vendor[];
  onClick: (vendor: Vendor) => void;
  bounds: BBox | undefined;
  zoom: number;
}

const getVendorIcon = (types: VendorTypes[]) => {
  // Prefer tours over other types
  if (types.includes("tours")) return <Binoculars size={14} />;

  // If no tours, prefer lessons
  if (types.includes("lessons")) return <GraduationCap size={14} />;

  // If no lessons, prefer rentals
  if (types.includes("rentals")) return <Timer size={14} />;

  // If no rentals, use tickets
  if (types.includes("tickets")) return <Ticket size={14} />;

  // Fallback to a generic icon if no types match
  return <Users size={14} />;
};

export const ClusteredVendorMarkers = ({
  vendors,
  onClick,
  bounds,
  zoom,
}: ClusteredVendorMarkersProps) => {
  const points = useMemo(
    () =>
      vendors.map(
        (vendor): Feature<Point, GeoJsonProperties> => ({
          type: "Feature",
          properties: vendor,
          geometry: {
            type: "Point",
            coordinates: vendor.location.coordinates,
          },
        })
      ),
    [vendors]
  );

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: bounds || [-180, -85, 180, 85], // Default to world bounds if none provided
    zoom,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          cluster_id,
          point_count,
        } = cluster.properties || {};

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster_id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <Chip
                icon={<Users size={14} />}
                label={`${point_count} Vendors`}
                onClick={() => {
                  const expansion = supercluster?.getLeaves(
                    cluster_id,
                    Infinity
                  );
                  if (expansion) {
                    // Handle cluster expansion
                  }
                }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              />
            </Marker>
          );
        }

        const vendor = cluster.properties as Vendor;

        return (
          <Marker
            key={vendor._id}
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <Chip
              icon={getVendorIcon(vendor.vendorTypes)}
              label={vendor.businessName}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(vendor);
              }}
              className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
              size="small"
            />
          </Marker>
        );
      })}
    </>
  );
};

import { Marker } from 'react-map-gl';
import Chip from '@mui/material/Chip';
import { VendorLocation, VendorTypes } from '@/components/mock-data/vendor-location';
import { Binoculars, GraduationCap, Timer, Ticket } from 'lucide-react';

const getVendorIcon = (type: VendorTypes) => {
  switch (type) {
    case 'tours':
      return <Binoculars size={14} />;
    case 'lessons':
      return <GraduationCap size={14} />;
    case 'rentals':
      return <Timer size={14} />;
    case 'tickets':
      return <Ticket size={14} />;
  }
};

export const VendorMarker: React.FC<{
  vendor: VendorLocation;
  onClick: () => void;
}> = ({ vendor, onClick }) => {
  const { coordinates } = vendor.geometry;
  const { businessName, vendorTypes } = vendor.properties;

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
    >
      <Chip
        icon={getVendorIcon(vendorTypes)}
        label={businessName}
        onClick={onClick}
        className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
        size="small"
      />
    </Marker>
  );
};

export default VendorMarker;
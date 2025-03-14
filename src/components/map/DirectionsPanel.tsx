import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DirectionStep {
  maneuver: {
    instruction: string;
    type: string;
  };
  distance: number;
  duration: number;
}

interface DirectionsPanelProps {
  loading: boolean;
  error: string | null;
  steps: DirectionStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  loading,
  error,
  steps,
  currentStepIndex,
  onStepChange,
}) => {
  const formatDistance = (meters: number) => {
    const miles = meters * 0.000621371;
    return miles < 0.1 
      ? `${Math.round(meters)} ft`
      : `${miles.toFixed(1)} mi`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      onStepChange(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      px: 2
    }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : steps.length > 0 ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%',
            gap: 1
          }}>
            <IconButton 
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              sx={{ 
                visibility: currentStepIndex === 0 ? 'hidden' : 'visible',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ChevronLeft />
            </IconButton>

            <Box sx={{ 
              flex: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Typography variant="body1">
                {steps[currentStepIndex].maneuver.instruction}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistance(steps[currentStepIndex].distance)}
              </Typography>
            </Box>

            <IconButton 
              onClick={handleNextStep}
              disabled={currentStepIndex === steps.length - 1}
              sx={{ 
                visibility: currentStepIndex === steps.length - 1 ? 'hidden' : 'visible',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              bottom: 8,
              color: 'text.secondary'
            }}
          >
            Step {currentStepIndex + 1} of {steps.length}
          </Typography>
        </>
      ) : null}
    </Box>
  );
};

export default DirectionsPanel;
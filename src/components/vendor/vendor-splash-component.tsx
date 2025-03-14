import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from "@/services/i18n/client";

export const VendorSplashComponent = () => {
  const router = useRouter();
  const { t } = useTranslation("vendor-splash");
  const [progress, setProgress] = useState(0);
  const duration = 3000;
  const interval = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + (interval / duration) * 100;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, interval);

    const redirect = setTimeout(() => {
      router.push('/vendor-status');
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <Box 
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        textAlign: 'center',
        background: 'radial-gradient(circle at center, #1a237e, #000000)'
      }}
    >
      <Typography 
        variant="h3" 
        gutterBottom
        sx={{ 
          color: 'primary.contrastText',
          mb: 4,
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {t("congratsMessage")}
      </Typography>
      
      <Typography 
        variant="h5"
        sx={{ 
          color: 'primary.contrastText',
          mb: 6,
          opacity: 0.9 
        }}
      >
        {t("journeyMessage")}
      </Typography>

      <Box sx={{ width: '80%', maxWidth: 400 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
              borderRadius: 4
            }
          }}
        />
      </Box>
    </Box>
  );
};
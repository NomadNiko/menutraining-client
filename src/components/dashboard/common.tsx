import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export const DashboardSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  background: 'rgba(17, 25, 40, 0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.125)',
}));
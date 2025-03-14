import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import { useTheme } from "@mui/material/styles";
import { Image } from "@nextui-org/react";

export default function PaymentMethods() {
 const { t } = useTranslation("cart");
 const theme = useTheme();

 const logoStyle = {
   height: 48, // Doubled from 24
   marginRight: 'auto', // Push logo to left side
   marginLeft: theme.spacing(2) // Use theme spacing
 };

 return (
   <Card>
     <CardContent>
       <Typography variant="h6" gutterBottom>
         {t("paymentMethods")}
       </Typography>
       
       <Stack spacing={2}>
         <Button
           variant="outlined"
           fullWidth
           startIcon={
             <Image
               src="https://logos-world.net/wp-content/uploads/2022/12/Stripe-Logo.png"
               alt="StripeLogo"
               style={logoStyle}
             />
           }
         >
           {t("payWithStripe")}
         </Button>
         
         <Button
           variant="outlined"
           fullWidth
           startIcon={
             <Image
               src="https://logos-world.net/wp-content/uploads/2020/12/Cash-App-Logo.png"
               alt="Cash App"
               style={logoStyle}
             />
           }
         >
           {t("payWithCashApp")}
         </Button>
         
         <Button
           variant="outlined"
           fullWidth
           startIcon={
             <Image
               src="https://logos-world.net/wp-content/uploads/2021/12/Venmo-Logo.png"
               alt="Venmo"
               style={logoStyle}
             />
           }
         >
           {t("payWithVenmo")}
         </Button>
         
         <Button
           variant="outlined"
           fullWidth
           startIcon={
             <Image
               src="https://logos-world.net/wp-content/uploads/2020/11/Square-Logo.png"
               alt="Square"
               style={logoStyle}
             />
           }
         >
           {t("payWithSquare")}
         </Button>
       </Stack>
     </CardContent>
   </Card>
 );
}
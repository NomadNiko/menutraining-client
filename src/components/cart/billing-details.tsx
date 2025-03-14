import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormTextInput from "@/components/form/text-input/form-text-input";
import { useTranslation } from "@/services/i18n/client";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type BillingDetailsFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("cart");
  
  return yup.object().shape({
    firstName: yup.string().required(t("validation.required")),
    lastName: yup.string().required(t("validation.required")),
    email: yup.string().email(t("validation.email")).required(t("validation.required")),
    phone: yup.string().required(t("validation.required")),
    address: yup.string().required(t("validation.required")),
    city: yup.string().required(t("validation.required")),
    state: yup.string().required(t("validation.required")),
    zipCode: yup.string().required(t("validation.required")),
  });
};

export default function BillingDetails() {
  const { t } = useTranslation("cart");
  const validationSchema = useValidationSchema();
  
  const methods = useForm<BillingDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("billingDetails")}
        </Typography>

        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormTextInput
                name="firstName"
                label={t("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextInput
                name="lastName"
                label={t("lastName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextInput
                name="email"
                label={t("email")}
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextInput
                name="phone"
                label={t("phone")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextInput
                name="address"
                label={t("address")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextInput
                name="city"
                label={t("city")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormTextInput
                name="state"
                label={t("state")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormTextInput
                name="zipCode"
                label={t("zipCode")}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
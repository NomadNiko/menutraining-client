"use client";
import React, { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { RoleEnum } from "@/services/api/types/role";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TabPanel from "@/components/menu-management/TabPanel";
import CreateAllergyForm from "@/components/menu-management/allergies/CreateAllergyForm";
import CreateIngredientForm from "@/components/menu-management/ingredients/CreateIngredientForm";
import CreateMenuItemForm from "@/components/menu-management/menu-items/CreateMenuItemForm";
import IngredientsList from "@/components/menu-management/ingredients/IngredientsList";
import AllergiesList from "@/components/menu-management/allergies/AllergiesList";
import MenuItemsList from "@/components/menu-management/menu-items/MenuItemsList";
import Divider from "@mui/material/Divider";

function a11yProps(index: number) {
  return {
    id: `menu-tab-${index}`,
    "aria-controls": `menu-tabpanel-${index}`,
  };
}

function MenuManagement() {
  const { t } = useTranslation("common");
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} pt={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("common:menuManagement.title")}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="menu management tabs"
              variant="fullWidth"
            >
              <Tab
                label={t("common:menuManagement.tabs.allergies")}
                {...a11yProps(0)}
              />
              <Tab
                label={t("common:menuManagement.tabs.ingredients")}
                {...a11yProps(1)}
              />
              <Tab
                label={t("common:menuManagement.tabs.menuItems")}
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={tabValue} index={0}>
            <Card>
              <CardHeader title={t("common:menuManagement.createAllergy")} />
              <CardContent>
                <CreateAllergyForm />
              </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* Allergies List */}
            <AllergiesList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {/* Ingredients Tab Content */}
            <Card>
              <CardHeader title={t("common:menuManagement.createIngredient")} />
              <CardContent>
                <CreateIngredientForm />
              </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* Ingredients List */}
            <IngredientsList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardHeader title={t("common:menuManagement.createMenuItem")} />
              <CardContent>
                <CreateMenuItemForm />
              </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* Menu Items List */}
            <MenuItemsList />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(MenuManagement, {
  roles: [RoleEnum.ADMIN],
});

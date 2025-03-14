"use client";

import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuthConfirmEmailService } from "@/services/api/services/auth";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";

export default function ConfirmEmail() {
  const fetchConfirmEmail = useAuthConfirmEmailService();
  const router = useRouter();
  const { t } = useTranslation("confirm-email");

  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get("hash");

      if (hash) {
        const { status } = await fetchConfirmEmail({
          hash,
        });

        if (status === HTTP_CODES_ENUM.NO_CONTENT) {
          router.replace("/profile");
        } else {
          router.replace("/");
        }
      }
    };

    confirm();
  }, [fetchConfirmEmail, router, t]);

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

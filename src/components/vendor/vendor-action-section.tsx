import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTranslation } from "@/services/i18n/client";
import { Check, X, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { VendorStatusEnum } from "@/app/[language]/types/vendor";
import { VendorActionProps } from "./types";

export const VendorActionSection: React.FC<VendorActionProps> = ({
  onAction,
  onDelete,
  onEdit,
  vendorId,
  notes,
  setNotes,
  isSubmitting,
}) => {
  const { t } = useTranslation("vendor-admin");
  const theme = useTheme();
  const { confirmDialog } = useConfirmDialog();

  const handleAction = async (action: VendorStatusEnum) => {
    if (isSubmitting) return;
    if (
      (action === VendorStatusEnum.REJECTED ||
        action === VendorStatusEnum.ACTION_NEEDED) &&
      !notes.trim()
    ) {
      return;
    }
    await onAction(vendorId, action, notes);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: t("deleteConfirm.title"),
      message: t("deleteConfirm.message"),
      successButtonText: t("deleteConfirm.confirm"),
      cancelButtonText: t("deleteConfirm.cancel"),
    });
    if (confirmed) {
      await onDelete(vendorId);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder={t("notesPlaceholder")}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          sx={{ background: theme.palette.success.main }}
          startIcon={<Check size={16} />}
          onClick={() => handleAction(VendorStatusEnum.APPROVED)}
          disabled={isSubmitting}
        >
          {t("approve")}
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<X size={16} />}
          onClick={() => handleAction(VendorStatusEnum.REJECTED)}
          disabled={isSubmitting}
        >
          {t("reject")}
        </Button>
        <Button
          variant="contained"
          color="warning"
          startIcon={<AlertTriangle size={16} />}
          onClick={() => handleAction(VendorStatusEnum.ACTION_NEEDED)}
          disabled={isSubmitting}
        >
          {t("needsAction")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Edit2 size={16} />}
          onClick={onEdit}
          disabled={isSubmitting}
        >
          {t("edit")}
        </Button>
        <Button
          variant="contained"
          sx={{
            background: theme.palette.error.main,
            ml: "auto",
          }}
          startIcon={<Trash2 size={16} />}
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {t("delete")}
        </Button>
      </Box>
    </>
  );
};
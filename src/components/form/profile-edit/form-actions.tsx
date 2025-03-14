import Button from "@mui/material/Button";
import { useFormState } from "react-hook-form";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import Link from "@/components/link";

interface FormActionsProps {
  submitLabel: string;
  cancelLabel: string;
  testId: string;
  cancelTestId: string;
  cancelHref: string;
}

export function FormActions({
  submitLabel,
  cancelLabel,
  testId,
  cancelTestId,
  cancelHref,
}: FormActionsProps) {
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isSubmitting}
        data-testid={testId}
      >
        {submitLabel}
      </Button>
      <Box ml={1} component="span">
        <Button
          variant="contained"
          color="inherit"
          LinkComponent={Link}
          href={cancelHref}
          data-testid={cancelTestId}
        >
          {cancelLabel}
        </Button>
      </Box>
    </>
  );
}

"use client";
import { ForwardedRef, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { TicketCategory } from "@/types/support-ticket";
import { useTranslation } from "@/services/i18n/client";

type CategorySelectProps = {
  label: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  size?: "small" | "medium";
};

function CategorySelectRaw(
  props: CategorySelectProps & {
    name: string;
    value: TicketCategory | undefined | null;
    onChange: (value: TicketCategory) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  const { t } = useTranslation("support-tickets");
  
  return (
    <FormControl fullWidth error={!!props.error} disabled={props.disabled} size={props.size}>
      <InputLabel id={`select-label-${props.name}`}>{props.label}</InputLabel>
      <Select
        ref={ref}
        labelId={`select-label-${props.name}`}
        id={`select-${props.name}`}
        value={props.value || ""}
        label={props.label}
        inputProps={{
          readOnly: props.readOnly,
        }}
        onChange={(event) => {
          props.onChange(event.target.value as TicketCategory);
        }}
        onBlur={props.onBlur}
        data-testid={props.testId}
      >
        {Object.values(TicketCategory).map((category) => (
          <MenuItem key={category} value={category}>
            {t(`categories.${category.toLowerCase()}`)}
          </MenuItem>
        ))}
      </Select>
      {!!props.error && (
        <FormHelperText data-testid={`${props.testId}-error`}>
          {props.error}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const CategorySelectInput = forwardRef(CategorySelectRaw);

function FormCategorySelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: CategorySelectProps &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CategorySelectInput
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          size={props.size}
        />
      )}
    />
  );
}

export default FormCategorySelect;
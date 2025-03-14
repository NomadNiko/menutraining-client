import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import DurationInput from "./DurationInput";

interface DurationInputWrapperProps {
  name: string;
  label: string;
  control: Control;
  required?: boolean;
}

export const DurationInputWrapper: React.FC<DurationInputWrapperProps> = ({
  name,
  label,
  control,
  required
}) => {
  const [incrementType, setIncrementType] = useState<
    "5mins" | "15mins" | "hours" | "days"
  >("15mins");

  return (
    <DurationInput
      name={name}
      label={label}
      control={control}
      required={required}
      incrementType={incrementType}
      onIncrementChange={(type) => setIncrementType(type)}
    />
  );
};
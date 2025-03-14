import { useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { FormValuesMonitorProps, FormData, BaseFieldValue } from './types';

export const FormValuesMonitor: React.FC<FormValuesMonitorProps> = ({ 
  onChange 
}) => {
  const formValues = useWatch({ control: useFormContext().control });
  
  useEffect(() => {
    if (onChange) {
      const cleanedValues = Object.entries(formValues).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value as BaseFieldValue;
        }
        return acc;
      }, {} as FormData);
      onChange(cleanedValues);
    }
  }, [onChange, formValues]);
  
  return null;
};

export default FormValuesMonitor;
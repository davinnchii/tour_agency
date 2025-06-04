// src/hooks/useYupValidationResolver.js
import { useCallback } from "react";
import { Schema, ValidationError } from "yup";

export const useYupValidationResolver = (validationSchema: Schema) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce((allErrors: ValidationError[], currentError: any) => {
            return {
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            };
          }, {}),
        };
      }
    },
    [validationSchema]
  );

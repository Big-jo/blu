import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Checks if a given value is a valid password using the conditions below.
 *
 * 1. Password must have a minimum of 6 characters.
 * 2. It must contain at least 1 uppercase character
 * 3. It must have at least 1 lowercase character
 * 4. Must contain at least any of these special characters - @#$%^&-+=()
 * 5. Must contain at least 1 digit
 */
export const IsValidPassword = (validationOptions?: ValidationOptions) =>
  function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;

          if (value.length < 6) return false;

          const regex =
            /(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&\-+*.=!_()])(?=.*[A-Z]).{8,}/;

          return regex.test(value);
        },
        defaultMessage() {
          return `
          ${propertyName} is invalid. It must:
          1. Have a minimum of 6 characters.
          2. Contain at least 1 uppercase character
          3. Have at least 1 lowercase character
          4. Contain at least any of these special characters - @#$%^&-+=()
          5. Contain at least 1 digit
          `.trim();
        },
      },
    });
  };

export const IsValidPhoneNumber = (validationOptions?: ValidationOptions) =>
  function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;

          const regex = /^(\+{1})?[0-9]{7,13}$/;
          return regex.test(value);
        },
        defaultMessage() {
          return `
          ${propertyName} is not a valid phone number. It must:
          1. Be between a minimum of 7 and maximum of 13 digits.
          2. Optionally have a single plus (+) sign at the beginning.
          `.trim();
        },
      },
    });
  };

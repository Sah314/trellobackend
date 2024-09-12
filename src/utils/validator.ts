import { ClassConstructor, plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

const validationError = async (
  input: any
): Promise<ValidationError[] | false> => {
  const error = await validate(input, { validationError: { target: false } });

  if (error.length) {
    return error;
  }
  return false;
};

export const requestValidator = async <T>(
  type: ClassConstructor<T>,
  body: any
): Promise<{ errors: boolean | string; input: T }> => {
  const input = plainToClass(type, body);

  const errors = await validationError(input);
  if (errors) {
    const errorMessages = errors
      .map((error) => (Object as any).values(error.constraints))
      .join(", ");
    return { errors: errorMessages, input };
  }

  return { errors: false, input };
};

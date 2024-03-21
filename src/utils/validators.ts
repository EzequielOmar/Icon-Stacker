import { z } from "zod";

export const EmailValidator = z
  .string()
  .email("Email is not valid")
  .min(1, "Email Required")
  .max(255, "Maximum length of email is 255");

export const PasswordValidator = z
  .string()
  .min(1, "Password Required")
  .max(255, "Maximum password length is 255")
  .regex(
    /^(?=.*?[A-Za-z])(?=.*\d)(?=.*[-'/`~!#*$@_%+=.,^&(){}[\]|;:"<>?\\])\S{6,}$/,
    "Password should be a minimum of 6 characters, including a letter, number and special character"
  );

export const RepeatPasswordValidator = z
  .string()
  .min(1, "Repeat Password Required");

export const UrlValidator = z.string().refine((value) => {
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    throw new Error("URL must start with http:// or https://");
  }
  return true;
});

export const validateWithRepeatPassword = (validators: any, fields: any) => {
  return z
    .object(validators)
    .refine((data: any) => data.password === data.repeatPassword, {
      message: "Passwords must match",
      path: ["repeatPassword"],
    })
    .safeParse(fields);
};

export const validate = (validators: any, fields: any) => {
  return z.object(validators).safeParse(fields);
};

export const object = (validators: any) => {
  return z.object(validators);
};

export const FileValidator =   z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
});
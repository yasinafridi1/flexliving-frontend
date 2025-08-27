// validationSchema.js
import * as Yup from 'yup';

export const emailValidation = Yup.string().email('Invalid email').required('Email is required');

export const loginSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Password is required')
});

export const registerSchema = Yup.object({
  fullName: Yup.string().min(2, 'Full Name must be at least 2 characters').required('Full Name is required'),
  email: emailValidation,
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-15 characters long'
    )
});

export const apiKeysSchema = Yup.object({
  clientId: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Client ID must be a valid number')
    .min(0, 'Client ID cannot be negative')
    .required('Client ID is required'),
  clientSecret: Yup.string().required('Client Secret is required')
});

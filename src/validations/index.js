// validationSchema.js
import * as Yup from 'yup';

export const emailValidation = Yup.string().email('Invalid email').required('Email is required');

export const loginSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Password is required')
});

export const userSchema = Yup.object({
  fullName: Yup.string().min(2, 'Full Name must be at least 2 characters').required('Full Name is required'),

  phone: Yup.string()
    .required('Phone number is required')
    .test('valid-phone', 'Phone must start with +92 or +966 and be 13 characters long', value => {
      if (!value) return false;
      const startsWithValidPrefix = value.startsWith('+92') || value.startsWith('+966');
      return startsWithValidPrefix && value.length === 13;
    }),

  email: emailValidation,
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-15 characters long'
    ),
  status: Yup.string().required('Status is required')
});

export const addUpdateTruckSchema = Yup.object({
  numberPlate: Yup.string().required('Number Plate is required'),
  chesosNumber: Yup.string().required('Chesos Number is required'),
  driverIqamaNumber: Yup.string()
    .required('Iqama number is required')
    .matches(/^\d{9,15}$/, 'Iqama number must be between 9 and 15 digits'),
  driverName: Yup.string().required('Driver name is required')
});

export const addUpdateSparePartSchema = Yup.object({
  name: Yup.string().required('Spare Part Name is required'),
  price: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be atleast 1')
});

export const addUpdateUsedPartSchema = Yup.object({
  partId: Yup.number().required('Part is required').min(1, 'Part must be atleast 1'),
  truckId: Yup.number().required('Truck  is required').min(1, 'Truck must be atleast 1'),
  quantityUsed: Yup.number().required('Quantity is required').min(1, 'Quantity must be atleast 1')
});

export const addEditLoadSchema = Yup.object({
  date: Yup.date().required('Date is required').typeError('Date must be in ISO format (YYYY-MM-DD)'),
  truckId: Yup.number().required('Truck  is required').min(1, 'Truck must be atleast 1'),
  amount: Yup.number().required('Amount required').min(0, 'Amount cannot be negative'),
  from: Yup.string().required('From is required'),
  to: Yup.string().required('To is required'),
  tripMoney: Yup.number().required('Trip  is required').min(0, 'Trip money cannot be negative'),
  payment: Yup.string().required('Payment is required')
});

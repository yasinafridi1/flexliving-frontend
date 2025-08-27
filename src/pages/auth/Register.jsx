import AuthLayout from '@layouts/AuthLayout';
import { Form, FormField } from '@maincomponents/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import { errorToast, successToast } from '@utils/toastUtil';
import { Link, useNavigate } from 'react-router-dom';
import api from '@utils/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      fullName: '',
      password: ''
    }
  });

  async function onSubmit(values) {
    try {
      const response = await api.post('/auth/register', values);
      console.log(' Response.data ===>', response.data);
      successToast(response?.data?.message || 'Register successfully!');
      navigate('/signin');
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Something went wrong!');
    }
  }

  return (
    <AuthLayout headerText='Register' description='Welcome to The Flex Living'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-full max-w-md mx-auto'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => <TextInput label='Full Name' type='text' placeHolder='Full Name' field={field} />}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => <TextInput label='Email' type='email' placeHolder='Email address' field={field} />}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => <PasswordInput label='Password' placeHolder='*********' field={field} />}
          />

          <div className='w-full flex'>
            <LoaderButton
              btnText='Register'
              loaderText='Registering...'
              loading={form.formState.isSubmitting}
              type='submit'
              className='w-full'
            />
          </div>
        </form>
        <div className='mt-4 text-center'>
          <p className='text-sm font-medium text-gray-600'>
            Already have an account?{' '}
            <Link to='/signin' className='text-primary hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register;

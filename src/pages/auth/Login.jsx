import AuthLayout from '@layouts/AuthLayout';
import { Form, FormField } from '@maincomponents/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import { useDispatch } from 'react-redux';
import { signIn } from '@redux/slice/authSlice';
import { storeTokens } from '@utils/localstorageutil';

const Login = () => {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values) {
    try {
      const response = await dispatch(signIn(values)).unwrap();
      storeTokens(response);
    } catch (error) {
      console.log('Error', error);
    }
  }

  return (
    <AuthLayout
      headerText='Login'
      description='Enter your email and password below to
      log into your account'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-full max-w-md mx-auto'>
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
              btnText='Login'
              loaderText='Logging in...'
              loading={form.formState.isSubmitting}
              type='submit'
              className='w-full'
              btn
            />
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;

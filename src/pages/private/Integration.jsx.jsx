import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@maincomponents/components/ui/card';
import hostawaylogo from '@assets/hostawaylogo.svg';
import TextInput from '@maincomponents/Inputs/TextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiKeysSchema } from '@validations/index';
import { Form, FormField } from '@maincomponents/components/ui/form';
import { useSelector } from 'react-redux';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import LoaderButtonDelete from '@maincomponents/loaders/LoaderButtonDelete';

const Integration = () => {
  const { data } = useSelector(state => state.auth);

  const form = useForm({
    resolver: yupResolver(apiKeysSchema),
    mode: 'all',
    defaultValues: {
      clientId: null,
      clientSecret: ''
    }
  });

  async function onSubmit(values) {}

  useEffect(() => {
    const { clientId, clientSecret } = data;
    form.reset({
      clientId,
      clientSecret
    });
  }, [data]);

  return (
    <div>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Integrations</h2>
        <p className='text-muted-foreground'>Manage your app keys here </p>
      </div>
      <div className='flex justify-between items-start gap-2 mt-5'>
        <Card className='flex-grow'>
          <CardHeader className='flex items-center justify-between'>
            {/* Left Image + Title */}
            <div className='flex items-center gap-3'>
              <img src={hostawaylogo} alt='integration' className='w-12 h-12 rounded-full object-fill' />
              <h2 className='text-sm md:text-base lg:text-lg font-semibold'>Hostaway Api Keys</h2>
            </div>

            {/* Right Button */}
            {data?.clientId ? (
              <div className='flex'>
                <LoaderButton
                  btnText='Connect'
                  loaderText='Connectting...'
                  loading={form.formState.isSubmitting}
                  type='submit'
                  className='w-full'
                  btn
                />
              </div>
            ) : data?.hostAwayConnection ? (
              <div className='flex'>
                <LoaderButtonDelete
                  btnText='Revoke Token'
                  loaderText='Revoking...'
                  loading={form.formState.isSubmitting}
                  type='submit'
                  className='w-full'
                  btn
                />
              </div>
            ) : null}
          </CardHeader>

          <CardContent>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden`}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-5 mt-4'>
                  <FormField
                    control={form.control}
                    name='clientId'
                    render={({ field }) => (
                      <TextInput label='Client Id' type='number' placeHolder='Enter Client Id' field={field} />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='clientSecret'
                    render={({ field }) => (
                      <TextInput label='Client Secret' type='text' placeHolder='Enter Client Secret' field={field} />
                    )}
                  />
                  <div className='w-full flex'>
                    <LoaderButton
                      btnText='Submit'
                      loaderText='Submitting...'
                      loading={form.formState.isSubmitting}
                      type='submit'
                      className='w-full'
                      btn
                    />
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integration;

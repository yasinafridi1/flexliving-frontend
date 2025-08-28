import { Card, CardHeader, CardTitle, CardContent } from '@maincomponents/components/ui/card';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import defaultProfile from '../../assets/defaultProfile.png';
import { Edit } from 'lucide-react';
import { editUser } from '@redux/slice/authSlice';

const profileSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
});

const Profile = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.auth);
  const [profileImage, setProfileImage] = useState(null);

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: data?.fullName || '',
      email: data?.email || ''
    },
    mode: 'all'
  });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
  };

  const onSubmit = async values => {
    try {
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      if (profileImage) formData.append('file', profileImage);

      await dispatch(editUser(formData));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Card className='mx-auto'>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Profile Image */}
        <div className='flex justify-center mb-6'>
          <div className='relative w-28 h-28'>
            {!profileImage ? (
              <img
                src={
                  data?.profilePicture ? `${import.meta.env.VITE_API_FILE_URL}/${data?.profilePicture}` : defaultProfile
                }
                alt='Profile'
                className='w-28 h-28 rounded-full object-cover border-2 border-gray-300'
              />
            ) : (
              <img
                src={URL.createObjectURL(profileImage)}
                alt='Profile'
                className='w-28 h-28 rounded-full object-cover border-2 border-gray-300'
              />
            )}

            <label
              htmlFor='profile-upload'
              className='absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100'
            >
              <Edit className='w-5 h-5 text-gray-600' />
            </label>
            <input type='file' id='profile-upload' className='hidden' accept='image/*' onChange={handleImageChange} />
          </div>
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => <TextInput label='Full Name' placeHolder='Enter full name' field={field} />}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => <TextInput label='Email' type='email' placeHolder='Enter email' field={field} />}
            />

            <div className='w-full flex'>
              <LoaderButton
                btnText='Update Profile'
                loaderText='Updating...'
                loading={form.formState.isSubmitting}
                type='submit'
                className='w-full'
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Profile;

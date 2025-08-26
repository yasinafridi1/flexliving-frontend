import { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import { userSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import { USER_STATUS } from '@data/Constants';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, editUser } from '@redux/slice/userSlice';
import { successToast } from '@utils/toastUtil';

const userStatusOptions = Object.entries(USER_STATUS).map(([key, value]) => ({
  label: value.charAt(0) + value.slice(1).toLowerCase(), // Makes it "Active", "Blocked", etc.
  value: value
}));

const AddEditUser = ({ isEdit, open, onClose }) => {
  let Once = true;
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.users);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit user' : 'Add User';

  const defaultValues = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    status: ''
  };

  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onBlur',
    defaultValues
  });

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      if (isEdit) {
        await dispatch(editUser({ id: selectedUser.userId, body: values })).unwrap();
        successToast('User updated successfully');
      } else {
        await dispatch(createUser(values)).unwrap();
        successToast('User created successfully');
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoader(false);
    }
  }

  useEffect(() => {
    if (Once) {
      Once = false;
      if (isEdit) {
        const { fullName, email, phone, password, status } = selectedUser;
        reset({
          fullName,
          email,
          phone,
          password,
          status
        });
      }
    }
  }, []);

  return (
    <AddEditBaseModal
      title={title}
      open={open}
      onClose={onClose}
      isLoading={modalLoader}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-full'>
        <Form {...form}>
          <form className='space-y-4 mt-6'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <TextInput label='Full Name' type='text' placeHolder='Enter full name' field={field} />
              )}
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

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <TextInput label='Contact Number' type='text' placeHolder='Enter contact number' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <SelectBox label='Status' placeholder='Choose status' options={userStatusOptions} field={field} />
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};

export default AddEditUser;

import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import { addUpdateSparePartSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createSparePart, editSparePart } from '@redux/slice/sparePartSlice';
import { createFormData } from '@utils/formData';
import FileUploadInput from '@maincomponents/Inputs/FileInput';

const AddEditSparePart = ({ isEdit, open, onClose }) => {
  let Once = true;
  const dispatch = useDispatch();
  const { selectedSparePart } = useSelector(state => state.spareparts);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Spare Part' : 'Add Spare Part';

  const defaultValues = {
    name: '',
    price: null,
    quantity: null,
    invoice: null
  };

  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(addUpdateSparePartSchema),
    mode: 'onBlur',
    defaultValues
  });

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);

    const { invoice } = values;
    const formData = createFormData(values);

    try {
      if (isEdit) {
        if (invoice instanceof File) {
          formData.append('file', invoice);
        } else if (invoice === null) {
          formData.append('fileRemoved', 'true');
        }
        await dispatch(editSparePart({ id: selectedSparePart.id, body: formData })).unwrap();
        successToast('Spare part updated successfully');
      } else {
        if (invoice) {
          formData.append('file', invoice);
        }
        await dispatch(createSparePart(formData)).unwrap();
        successToast('Spare part created successfully');
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
        const { name, quantity, price, invoice } = selectedSparePart;
        reset({
          name,
          quantity,
          price,
          invoice
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
              name='name'
              render={({ field }) => (
                <TextInput label='Spare Part Name' type='text' placeHolder='Enter spare part name' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <TextInput label='Price' type='number' placeHolder='Enter price per unit' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <TextInput label='Quantity' type='number' placeHolder='Enter available quantity' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='invoice'
              render={({ field }) => (
                <FileUploadInput
                  label='Upload Invoice'
                  field={field}
                  existingFileUrl={selectedSparePart?.invoice} // optional
                />
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};

export default AddEditSparePart;

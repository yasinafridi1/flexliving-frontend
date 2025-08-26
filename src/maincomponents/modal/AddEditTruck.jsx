import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import { addUpdateTruckSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createtruck, editTruck } from '@redux/slice/truckSlice';
import FileUploadInput from '@maincomponents/Inputs/FileInput';
import { createFormData } from '@utils/formData';

const AddEditTruck = ({ isEdit, open, onClose }) => {
  let Once = true;
  const dispatch = useDispatch();
  const { selectedTruck } = useSelector(state => state.trucks);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Truck' : 'Add Truck';

  const defaultValues = {
    numberPlate: '',
    chesosNumber: '',
    driverIqamaNumber: '',
    driverName: '',
    iqamaDocument: null
  };

  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(addUpdateTruckSchema),
    mode: 'onBlur',
    defaultValues
  });

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const { iqamaDocument } = values;
      const formData = createFormData(values);
      if (isEdit) {
        if (iqamaDocument instanceof File) {
          formData.append('file', iqamaDocument);
        } else if (iqamaDocument === null) {
          formData.append('fileRemoved', 'true');
        }
        await dispatch(editTruck({ id: selectedTruck.id, body: formData })).unwrap();
        successToast('Truck updated successfully');
      } else {
        if (iqamaDocument) {
          formData.append('file', iqamaDocument);
        }
        await dispatch(createtruck(formData)).unwrap();
        successToast('Truck created successfully');
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
        const { numberPlate, chesosNumber, driverIqamaNumber, driverName, iqamaDocument } = selectedTruck;
        reset({
          numberPlate,
          chesosNumber,
          driverIqamaNumber,
          driverName,
          iqamaDocument
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
              name='driverName'
              render={({ field }) => (
                <TextInput label='Driver Name' type='text' placeHolder='Enter driver name' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='numberPlate'
              render={({ field }) => (
                <TextInput label='Number Plate' type='text' placeHolder='Enter truck number plate' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='chesosNumber'
              render={({ field }) => (
                <TextInput label='Chesos Number' type='text' placeHolder='Enter chesos number' field={field} />
              )}
            />

            <FormField
              control={form.control}
              name='driverIqamaNumber'
              render={({ field }) => (
                <TextInput
                  label='Driver Iqama number'
                  type='text'
                  placeHolder='Enter driver iqama number'
                  field={field}
                />
              )}
            />

            <FormField
              control={form.control}
              name='iqamaDocument'
              render={({ field }) => (
                <FileUploadInput
                  label='Upload Iqama'
                  field={field}
                  existingFileUrl={selectedTruck?.iqamaDocument} // optional
                />
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};

export default AddEditTruck;

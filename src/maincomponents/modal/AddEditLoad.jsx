import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { addEditLoadSchema } from '@validations/index';
import DateInput from '@maincomponents/Inputs/DateInput';
import { fetchTruckOptions } from '@redux/slice/truckSlice';
import SelectWithSearchInput from '@maincomponents/Inputs/SelectWithSearch';
import { createLoad, editLoad } from '@redux/slice/loadSlice';
import { PAYMENT_OPTIONS } from '@data/Constants';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import FileUploadInput from '@maincomponents/Inputs/FileInput';
import { createFormData } from '@utils/formData';

const paymentOptions = Object.entries(PAYMENT_OPTIONS).map(([key, value]) => ({
  label: value.charAt(0) + value.slice(1).toLowerCase(), // Makes it "Active", "Blocked", etc.
  value: value
}));

const AddEditLoad = ({ isEdit, open, onClose }) => {
  let Once = true;
  const dispatch = useDispatch();
  const { options, optionLoader } = useSelector(state => state.trucks);
  const { selectedLoad } = useSelector(state => state.loads);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Load' : 'Add Load';
  const defaultValues = {
    date: '',
    from: '',
    to: '',
    truckId: null,
    amount: null,
    payment: PAYMENT_OPTIONS.cash,
    invoice: null,
    tripMoney: null
  };

  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(addEditLoadSchema),
    mode: 'all',
    defaultValues
  });

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const { invoice } = values;
      const formData = createFormData(values);
      if (isEdit) {
        if (invoice instanceof File) {
          formData.append('file', invoice);
        } else if (invoice === null) {
          formData.append('fileRemoved', 'true');
        }

        await dispatch(editLoad({ id: selectedLoad.id, body: formData })).unwrap();
        successToast('User updated successfully');
      } else {
        if (invoice) {
          formData.append('file', invoice);
        }
        await dispatch(createLoad(formData)).unwrap();
        successToast('Load created successfully');
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
      dispatch(fetchTruckOptions());
      if (isEdit) {
        const { date, from, to, truck, amount, payment, invoice, tripMoney } = selectedLoad;
        reset({
          date,
          from,
          to,
          truckId: truck.id,
          amount,
          payment,
          invoice,
          tripMoney
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
      isShowSubmit={options.length}
      onSubmit={handleSubmit(onSubmit)}
    >
      {optionLoader ? (
        <div className='flex justify-center items-center h-[200px] w-full'>
          <div className='w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
        </div>
      ) : !optionLoader && !options.length ? (
        <div className='flex justify-center items-center h-[200px] w-full'>
          <p>Please add truck first</p>
        </div>
      ) : (
        <div className='w-full'>
          <Form {...form}>
            <form className='space-y-4 mt-6' onSubmit={handleSubmit(onSubmit)}>
              {/* Date input */}
              <FormField
                control={form.control}
                name='date'
                render={({ field, fieldState }) => (
                  <DateInput label='Date' placeholder='Select a date' field={field} error={fieldState.error?.message} />
                )}
              />

              {/* From input */}
              <FormField
                control={form.control}
                name='from'
                render={({ field }) => (
                  <TextInput label='From' type='text' placeHolder='Enter start location' field={field} />
                )}
              />

              {/* To input */}
              <FormField
                control={form.control}
                name='to'
                render={({ field }) => (
                  <TextInput label='To' type='text' placeHolder='Enter destination' field={field} />
                )}
              />

              {/* Truck select */}
              <FormField
                control={form.control}
                name='truckId'
                render={({ field, fieldState }) => (
                  <SelectWithSearchInput
                    label='Truck'
                    options={options.map(opt => ({ label: opt.numberPlate, value: opt.id }))}
                    placeholder='Select a truck'
                    value={field.value}
                    onChange={field.onChange}
                    id='truck-select'
                    error={fieldState.error?.message}
                  />
                )}
              />

              {/* Amount input */}
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <TextInput label='Amount' type='number' placeHolder='Enter amount' field={field} />
                )}
              />

              <FormField
                control={form.control}
                name='tripMoney'
                render={({ field }) => (
                  <TextInput label='Trip Money' type='number' placeHolder='Enter trip money' field={field} />
                )}
              />

              <FormField
                control={form.control}
                name='payment'
                render={({ field }) => (
                  <SelectBox
                    label='Payment Method'
                    placeholder='Choose payment'
                    options={paymentOptions}
                    field={field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name='invoice'
                render={({ field }) => (
                  <FileUploadInput
                    label='Upload Invoice'
                    field={field}
                    existingFileUrl={selectedLoad?.invoice} // optional
                  />
                )}
              />
            </form>
          </Form>
        </div>
      )}
    </AddEditBaseModal>
  );
};

export default AddEditLoad;

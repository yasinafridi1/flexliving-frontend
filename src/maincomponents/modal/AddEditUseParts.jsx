import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { addUpdateUsedPartSchema } from '@validations/index';
import { fetchTruckOptions } from '@redux/slice/truckSlice';
import SelectWithSearchInput from '@maincomponents/Inputs/SelectWithSearch';
import { fetchSparePartOptions } from '@redux/slice/sparePartSlice';
import { createUsePart, editUsePart } from '@redux/slice/usedPartsSlice';

const AddEditUseParts = ({ isEdit, open, onClose }) => {
  let Once = true;
  const dispatch = useDispatch();
  const { options: truckOptions, optionLoader: truckOptionLoader } = useSelector(state => state.trucks);
  const { options: sparePartOptions, optionLoader: sparePartOptionLoader } = useSelector(state => state.spareparts);
  const { selectedUsePart } = useSelector(state => state.usedparts);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Load' : 'Add Load';

  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(addUpdateUsedPartSchema),
    mode: 'onBlur',
    defaultValues: {
      partId: null,
      truckId: null,
      quantityUsed: 1
    }
  });

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      if (isEdit) {
        await dispatch(editUsePart({ id: selectedUsePart.id, body: values })).unwrap();
        successToast('Part updated successfully');
      } else {
        await dispatch(createUsePart(values)).unwrap();
        successToast('Part used successfully');
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
      dispatch(fetchSparePartOptions());
      if (isEdit) {
        const { sparePart, truck, quantityUsed } = selectedUsePart;
        reset({
          partId: sparePart.id,
          truckId: truck.id,
          quantityUsed
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
      isShowSubmit={sparePartOptions?.length && truckOptions?.length}
      onSubmit={handleSubmit(onSubmit)}
    >
      {truckOptionLoader || sparePartOptionLoader ? (
        <div className='flex justify-center items-center h-[200px] w-full'>
          <div className='w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin' />
        </div>
      ) : (!truckOptionLoader || !sparePartOptionLoader) && (!truckOptions?.length || !sparePartOptions?.length) ? (
        <div className='flex justify-center items-center h-[200px] w-full'>
          <p>Please add truck or spare part first</p>
        </div>
      ) : (
        <div className='w-full'>
          <Form {...form}>
            <form className='space-y-4 mt-6' onSubmit={handleSubmit(onSubmit)}>
              {/* Truck select */}
              <FormField
                control={form.control}
                name='truckId'
                render={({ field, fieldState }) => (
                  <SelectWithSearchInput
                    label='Truck'
                    options={truckOptions.map(opt => ({ label: opt.numberPlate, value: opt.id }))}
                    placeholder='Select a truck'
                    value={field.value}
                    onChange={field.onChange}
                    id='truck-select'
                    error={fieldState.error?.message}
                  />
                )}
              />

              <FormField
                control={form.control}
                name='partId'
                render={({ field, fieldState }) => (
                  <SelectWithSearchInput
                    label='Spare Part'
                    options={sparePartOptions.map(opt => ({ label: opt.name, value: opt.id, badge: opt.quantity }))}
                    placeholder='Select spare part'
                    value={field.value}
                    onChange={field.onChange}
                    id='sparepart-select'
                    error={fieldState.error?.message}
                  />
                )}
              />

              {/* Amount input */}
              <FormField
                control={form.control}
                name='quantityUsed'
                render={({ field }) => (
                  <TextInput label='Quantity Used' type='number' placeHolder='Enter quantity' field={field} />
                )}
              />
            </form>
          </Form>
        </div>
      )}
    </AddEditBaseModal>
  );
};

export default AddEditUseParts;

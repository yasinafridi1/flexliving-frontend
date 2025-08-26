import { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { removeTruck, removeTruckForcely } from '@redux/slice/truckSlice';

const DeleteTruck = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedTruck } = useSelector(state => state.trucks);
  async function onSubmit() {
    setModalLoader(true);
    try {
      await dispatch(removeTruck(selectedTruck.id)).unwrap();
      successToast('Truck deleted successfully');
      dispatch(removeTruckForcely(selectedTruck.id));
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoader(false);
    }
  }
  return (
    <BaseDeleteModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={modalLoader}
      title={'Delete truck!'}
      message='Are you sure you want to delete this truck?'
    />
  );
};

export default DeleteTruck;

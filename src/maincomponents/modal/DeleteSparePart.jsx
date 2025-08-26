import { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { removeSparePart, removeSparePartForcely } from '@redux/slice/sparePartSlice';

const DeleteSparePart = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedSparePart } = useSelector(state => state.spareparts);
  async function onSubmit() {
    setModalLoader(true);
    try {
      await dispatch(removeSparePart(selectedSparePart.id)).unwrap();
      successToast('Sparepart deleted successfully');
      dispatch(removeSparePartForcely(selectedSparePart.id));
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
      title={'Delete Spare Part!'}
      message='Are you sure you want to delete this spare part?'
    />
  );
};

export default DeleteSparePart;

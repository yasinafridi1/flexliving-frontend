import { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { removeLoad, removeLoadForcely } from '@redux/slice/loadSlice';

const DeleteLoad = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedLoad } = useSelector(state => state.loads);
  async function onSubmit() {
    setModalLoader(true);
    try {
      await dispatch(removeLoad(selectedLoad.id)).unwrap();
      successToast('Load deleted successfully');
      dispatch(removeLoadForcely(selectedLoad.id));
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
      title={'Delete Load!'}
      message='Are you sure you want to delete this load?'
    />
  );
};

export default DeleteLoad;

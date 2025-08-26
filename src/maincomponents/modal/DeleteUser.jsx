import { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser, removeUserForce } from '@redux/slice/userSlice';
import { successToast } from '@utils/toastUtil';

const DeleteUser = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedUser } = useSelector(state => state.users);
  async function onSubmit() {
    setModalLoader(true);
    try {
      await dispatch(removeUser(selectedUser.userId)).unwrap();
      successToast('User deleted successfully');
      dispatch(removeUserForce(selectedUser.userId));
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
      title={'Delete User!'}
      message='Are you sure you want to delete this user?'
    />
  );
};

export default DeleteUser;

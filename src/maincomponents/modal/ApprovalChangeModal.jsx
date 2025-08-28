import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseAlertModal from './BaseAlertModal';
import { editReviewApproval } from '@redux/slice/reviewSlice';
import { successToast } from '@utils/toastUtil';

const ApprovalChangeModal = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedItem } = useSelector(state => state.reviews);
  async function onSubmit() {
    setModalLoader(true);
    try {
      await dispatch(editReviewApproval(selectedItem._id)).unwrap();
      successToast('Approval status changed successfully');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoader(false);
    }
  }
  return (
    <BaseAlertModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={modalLoader}
      title={'Change Approval Status'}
      message='Are you sure you want to change the approval status?'
    />
  );
};

export default ApprovalChangeModal;

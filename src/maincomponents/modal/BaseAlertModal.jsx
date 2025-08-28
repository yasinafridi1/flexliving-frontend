import { Button } from '@maincomponents/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@maincomponents/components/ui/dialog';
import LoaderButton from '@maincomponents/loaders/LoaderButton';

const BaseAlertModal = ({ title, message, onClose, onSubmit, open, isLoading }) => {
  function onOpenChange() {
    if (isLoading) {
      return;
    } else {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='grid grid-cols-2 gap-3'>
          <DialogClose asChild>
            <Button className='flex-grow' disabled={isLoading} variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <LoaderButton loading={isLoading} onClick={onSubmit} btnText={'Submit'} type='button' />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseAlertModal;

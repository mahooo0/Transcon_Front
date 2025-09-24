import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Employee } from '@/services/employees/types';
import React from 'react';

interface IChangeStatusModalProps {
  deactivateDialog: {
    isOpen: boolean;
    employee: Employee | null;
  };
  handleDeactivateCancel: () => void;
  handleDeactivateConfirm: () => void;
}

const ChangeStatusModal: React.FC<IChangeStatusModalProps> = ({
  deactivateDialog,
  handleDeactivateCancel,
  handleDeactivateConfirm,
}) => {
  const isActive = deactivateDialog.employee?.isActive;
  return (
    <>
      <AlertDialog
        open={deactivateDialog.isOpen}
        onOpenChange={(open) => !open && handleDeactivateCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? 'Деактивировать' : 'Активировать'} сотрудника
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите{' '}
              {isActive ? 'деактивировать' : 'активировать'} сотрудника{' '}
              <strong>
                {deactivateDialog.employee?.firstName}{' '}
                {deactivateDialog.employee?.lastName}
              </strong>
              ? Это действие можно будет отменить позже.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeactivateCancel}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActive ? 'Деактивировать' : 'Активировать'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChangeStatusModal;

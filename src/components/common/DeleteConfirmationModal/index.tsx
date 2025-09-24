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
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-gradient-to-r from-white to-slate-50 border border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-sm">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-slate-800">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-slate-600 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Внимание!</p>
              <p>
                Это действие нельзя отменить. Данные будут удалены навсегда.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex gap-3 pt-4">
          <AlertDialogCancel
            disabled={isLoading}
            className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 border-slate-200"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Удалить
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;

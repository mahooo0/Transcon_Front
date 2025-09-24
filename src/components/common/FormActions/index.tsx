import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  showSubmit?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
  submitText = 'Сохранить',
  cancelText = 'Отмена',
  showSubmit = true,
}) => {
  return (
    <div className="flex gap-4 pt-6 border-t border-slate-200/60">
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
        >
          {cancelText}
        </Button>
      )}
      {showSubmit && (
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          onClick={onSubmit}
          className={`${onCancel ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Сохранение...
            </div>
          ) : (
            submitText
          )}
        </Button>
      )}
    </div>
  );
};

export default FormActions;

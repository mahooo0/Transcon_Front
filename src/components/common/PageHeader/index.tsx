import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
  children?: React.ReactNode;
  goBack?: () => void;
  goBackText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAdd,
  addButtonText = 'Добавить',
  children,
  goBack,
  goBackText = 'Назад',
}) => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {goBack && (
              <Button
                onClick={goBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={18} />
                {goBackText}
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            {children}
            {onAdd && (
              <Button
                onClick={onAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
              >
                <Plus size={20} />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

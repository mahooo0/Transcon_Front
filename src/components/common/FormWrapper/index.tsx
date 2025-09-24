import React from 'react';

interface FormWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ">
      <div className={`${className}`}>
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;

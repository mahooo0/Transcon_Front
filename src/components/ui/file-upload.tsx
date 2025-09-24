import React, { useRef } from 'react';
import { Button } from './button';
import { Plus, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  onRemoveFile?: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  currentFilesCount?: number;
  label?: string;
  files?: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onRemoveFile,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  maxFiles = 7,
  currentFilesCount = 0,
  label = 'Документы',
  files = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && currentFilesCount < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && currentFilesCount < maxFiles) {
      onFileSelect(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const isDisabled = disabled || currentFilesCount >= maxFiles;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Upload area */}
        <div
          className={`
            relative w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer flex-shrink-0
            transition-colors duration-200 ease-in-out overflow-hidden
            ${
              isDisabled
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-400 bg-white hover:border-gray-500 hover:bg-gray-50'
            }
          `}
          onClick={handleClick}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Plus
              className={`
                w-8 h-8 mb-2
                ${isDisabled ? 'text-gray-400' : 'text-gray-500'}
              `}
            />
            <span
              className={`
                text-xs font-medium text-center px-2
                ${isDisabled ? 'text-gray-400' : 'text-gray-600'}
              `}
            >
              {label}
            </span>
            <span
              className={`
                text-xs mt-1
                ${isDisabled ? 'text-gray-400' : 'text-gray-500'}
              `}
            >
              {currentFilesCount}/{maxFiles}
            </span>
          </div>
        </div>

        {/* Files preview */}
        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto flex-1 min-h-32">
            {files.map((file, index) => (
              <div key={index} className="relative flex-shrink-0">
                <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {onRemoveFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 opacity-100 transition-opacity w-6 h-6 p-0 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={isDisabled}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;

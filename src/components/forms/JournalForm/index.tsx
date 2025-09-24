import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import FileUpload from '@/components/ui/file-upload';
import { journalSchema, JournalFormData } from '@/schemas/journal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

interface JournalFormProps {
  onSubmit: (data: JournalFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<JournalFormData>;
  freights?: Array<{
    id: string;
    loadingCode: string;
    countries: string;
  }>;
  isLoadingFreights?: boolean;
  isViewMode?: boolean;
}

export default function JournalForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  freights = [],
  isLoadingFreights = false,
  isViewMode = false,
}: JournalFormProps) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      incidentDate: '',
      incidentType: '',
      culprit: '',
      currency: 'EUR',
      freight: '',
      freightId: '',
      incidentDescription: '',
      amount: '',
      note: '',
      documents: [],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFiles(fileArray);
      form.setValue('documents', fileArray);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    form.setValue('documents', newFiles);
  };

  const onFormSubmit = (data: JournalFormData) => {
    onSubmit(data);
  };

  const pageTitle = isViewMode
    ? 'Просмотр записи журнала'
    : initialData
      ? 'Редактировать запись журнала'
      : 'Создать запись журнала';

  // Подготавливаем опции для селектов
  const freightOptions = freights.map((freight) => ({
    value: freight.id,
    label: `${freight.loadingCode} - ${freight.countries}`,
  }));

  const incidentTypeOptions = [
    { value: 'ACCIDENT', label: 'Авария' },
    { value: 'THEFT', label: 'Кража' },
    { value: 'DAMAGE', label: 'Повреждение' },
    { value: 'VIOLATION', label: 'Нарушение' },
    { value: 'OTHER', label: 'Другое' },
  ];

  const culpritOptions = [
    { value: 'DRIVER', label: 'Водитель' },
    { value: 'COMPANY', label: 'Компания' },
    { value: 'THIRD_PARTY', label: 'Третья сторона' },
    { value: 'FORCE_MAJEURE', label: 'Форс-мажор' },
  ];

  const currencyOptions = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
  ];

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="incidentDate"
              type="date"
              label="Дата происшествия"
              placeholder="Дата происшествия"
              required
            />
            <CustomFormField
              control={form.control}
              name="incidentType"
              type="select"
              label="Тип происшествия"
              placeholder="Выберите тип происшествия"
              options={incidentTypeOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="culprit"
              type="select"
              label="Виновник"
              placeholder="Выберите виновника"
              options={culpritOptions}
              required
            />
            <CustomFormField
              control={form.control}
              name="currency"
              type="select"
              label="Валюта"
              placeholder="Выберите валюту"
              options={currencyOptions}
              required
            />
          </div>

          {/* Фрахт */}
          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="freightId"
              type="select"
              label="Фрахт"
              placeholder={
                isLoadingFreights ? 'Загрузка фрахтов...' : 'Выберите фрахт'
              }
              options={freightOptions}
              required
            />
          </div>

          {/* Описание и сумма */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="amount"
              type="number"
              label="Сумма"
              placeholder="0.00"
              step="0.01"
              required
            />
            <CustomFormField
              control={form.control}
              name="note"
              type="text"
              label="Примечание"
              placeholder="Дополнительные примечания..."
            />
          </div>

          {/* Описание происшествия */}
          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="incidentDescription"
              type="textarea"
              label="Описание происшествия"
              placeholder="Подробно опишите происшествие..."
              rows={4}
              required
            />
          </div>

          {/* Документы */}
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-white/50">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Документы
              </h3>
              <FormField
                control={form.control}
                name="documents"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleFileUpload}
                        onRemoveFile={removeFile}
                        accept="image/*,.pdf"
                        multiple={true}
                        maxFiles={5}
                        currentFilesCount={files.length}
                        label="Документы происшествия"
                        files={files}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!isViewMode && (
            <FormActions
              onCancel={onCancel}
              isLoading={isLoading}
              submitText="Сохранить запись"
            />
          )}

          {isViewMode && onCancel && (
            <div className="flex justify-center pt-6 border-t border-slate-200/60">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 border border-slate-200"
              >
                Назад к списку записей
              </button>
            </div>
          )}
        </form>
      </Form>
    </FormWrapper>
  );
}

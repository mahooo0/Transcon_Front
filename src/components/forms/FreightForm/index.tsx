/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { freightSchema, FreightFormData } from '@/schemas/freight';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/ui/file-upload';
import { useGetTrucksOnBase } from '@/hooks/trucks/useGetTrucksOnBase';
import { useGetTrailersOnBase } from '@/hooks/trailers/useGetTrailersOnBase';
import { useGetDriversOnBase } from '@/hooks/drivers/useGetDriversOnBase';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

interface FreightFormProps {
  onSubmit: (data: FreightFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: FreightFormData | null;
  isViewMode?: boolean;
}

export const FreightForm: React.FC<FreightFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  isViewMode = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Получаем данные для селектов
  const { data: trucksOnBase } = useGetTrucksOnBase();
  const { data: trailersOnBase } = useGetTrailersOnBase();
  const { data: driversOnBase } = useGetDriversOnBase();

  const form = useForm<FreightFormData>({
    resolver: zodResolver(freightSchema) as any,
    defaultValues: initialData || {
      truckId: '',
      trailerId: '',
      driverId: '',
      loadingDate: '',
      unloadingDate: '',
      loadingCode: '',
      unloadingCode: '',
      countries: '',
      kilometers: 0,
      ratePerKm: 0,
      currency: 'EUR',
      totalAmount: 0,
      contractorString: '',
      logist: '',
      general: '',
      expectedPaymentDate: '',
      paymentStatus: '',
      status: '',
      files: [],
    },
  });

  // Обновляем значения формы когда initialData изменяется
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const newFiles = [...uploadedFiles, ...fileArray].slice(0, 5);
      setUploadedFiles(newFiles);
      form.setValue('files', newFiles as any);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue('files', newFiles as any);
  };

  // Автоматический расчет общей суммы
  const watchedValues = form.watch(['kilometers', 'ratePerKm']);
  const [kilometers, ratePerKm] = watchedValues;

  useEffect(() => {
    if (kilometers && ratePerKm) {
      const total = Number(kilometers) * Number(ratePerKm);
      form.setValue('totalAmount', total);
    }
  }, [kilometers, ratePerKm, form]);

  const onFormSubmit = (data: FreightFormData) => {
    onSubmit(data);
  };

  const isEdit = !!initialData && !isViewMode;

  const pageTitle = isViewMode
    ? 'Просмотр груза'
    : initialData
      ? 'Редактировать груз'
      : 'Создать груз';

  // Подготавливаем опции для селектов
  const truckOptions =
    trucksOnBase?.map((truck) => ({
      value: truck.id,
      label: `${truck.registrationNumber} - ${truck.brand} ${truck.model}`,
    })) || [];

  const trailerOptions =
    trailersOnBase?.map((trailer) => ({
      value: trailer.id,
      label: `${trailer.registrationNumber} - ${trailer.vinNumber}`,
    })) || [];

  const driverOptions =
    driversOnBase?.map((driver) => ({
      value: driver.id,
      label: `${driver.firstName} ${driver.lastName}`,
    })) || [];

  const currencyOptions = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Ожидает оплаты' },
    { value: 'PAID', label: 'Оплачен' },
    { value: 'OVERDUE', label: 'Просрочен' },
    { value: 'PARTIAL', label: 'Частично оплачен' },
  ];

  const statusOptions = [
    { value: 'PLANNED', label: 'Запланирован' },
    { value: 'IN_PROGRESS', label: 'В процессе' },
    { value: 'COMPLETED', label: 'Завершен' },
    { value: 'CANCELLED', label: 'Отменен' },
    { value: 'DELAYED', label: 'Задержан' },
  ];

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="truckId"
              type="select"
              label="Тягач"
              placeholder="Выберите тягач"
              options={truckOptions}
              required
            />
            <CustomFormField
              control={form.control}
              name="trailerId"
              type="select"
              label="Прицеп"
              placeholder="Выберите прицеп"
              options={trailerOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="driverId"
              type="select"
              label="Водитель"
              placeholder="Выберите водителя"
              options={driverOptions}
              required
            />
          </div>

          {/* Даты */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="loadingDate"
              type="date"
              label="Дата загрузки"
              placeholder="Дата загрузки"
              required
            />
            <CustomFormField
              control={form.control}
              name="unloadingDate"
              type="date"
              label="Дата выгрузки"
              placeholder="Дата выгрузки"
              required
            />
          </div>

          {/* Коды */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="loadingCode"
              type="text"
              label="Код загрузки"
              placeholder="Введите код загрузки"
              required
            />
            <CustomFormField
              control={form.control}
              name="unloadingCode"
              type="text"
              label="Код выгрузки"
              placeholder="Введите код выгрузки"
              required
            />
          </div>

          {/* Маршрут и расстояние */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="countries"
              type="text"
              label="Страны маршрута"
              placeholder="Например: PL-DE (макс. 10 символов)"
              required
            />
            <CustomFormField
              control={form.control}
              name="kilometers"
              type="number"
              label="Километры"
              placeholder="0"
              step="1"
              required
            />
          </div>

          {/* Финансы */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CustomFormField
              control={form.control}
              name="ratePerKm"
              type="number"
              label="Ставка за км"
              placeholder="0.00"
              step="0.01"
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
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Общая сумма
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled
                      className="px-4 py-3 border border-slate-200 bg-slate-50 text-slate-600 rounded-xl cursor-not-allowed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Статусы (только в режиме редактирования) */}
          {isEdit && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomFormField
                control={form.control}
                name="paymentStatus"
                type="select"
                label="Статус платежа"
                placeholder="Выберите статус платежа"
                options={paymentStatusOptions}
              />
              <CustomFormField
                control={form.control}
                name="status"
                type="select"
                label="Статус груза"
                placeholder="Выберите статус груза"
                options={statusOptions}
              />
            </div>
          )}

          {/* Контрагент и логист */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="contractorString"
              type="text"
              label="Фирма-контрагент"
              placeholder="Введите название фирмы"
              required
            />
            <CustomFormField
              control={form.control}
              name="logist"
              type="text"
              label="Логист"
              placeholder="Введите имя логиста"
              required
            />
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="expectedPaymentDate"
              type="date"
              label="Дата ожидаемой оплаты"
              placeholder="Дата ожидаемой оплаты"
              required
            />
            <CustomFormField
              control={form.control}
              name="general"
              type="textarea"
              label="Общие примечания"
              placeholder="Введите дополнительные примечания..."
              rows={4}
            />
          </div>

          {/* Файлы */}
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-white/50">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Документы
              </h3>
              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleFileUpload}
                        onRemoveFile={removeFile}
                        accept="image/*,.pdf"
                        multiple={true}
                        maxFiles={5}
                        currentFilesCount={uploadedFiles.length}
                        label="Документы груза"
                        files={[]}
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
              submitText="Сохранить груз"
            />
          )}

          {isViewMode && (
            <div className="flex justify-center pt-6 border-t border-slate-200/60">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 border border-slate-200"
              >
                Назад к списку грузов
              </button>
            </div>
          )}
        </form>
      </Form>
    </FormWrapper>
  );
};

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema, DriverFormData } from '@/schemas/driver';
import { Form } from '@/components/ui/form';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

interface DriversFormProps {
  onSubmit: (data: DriverFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: DriverFormData | null;
}

export default function DriversForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: DriversFormProps) {
  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      phone: '',
      contractEndDate: '',
      dailyRate: '',
      currency: 'PLN',
      notes: '',
    },
  });

  // Обновляем значения формы когда initialData изменяется
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onFormSubmit = (data: DriverFormData) => {
    onSubmit(data);
  };

  return (
    <FormWrapper
      title={initialData ? 'Редактировать водителя' : 'Создать водителя'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка */}
            <div className="space-y-6">
              <CustomFormField
                control={form.control}
                name="firstName"
                type="text"
                label="Имя"
                placeholder="Введите имя"
                required
              />

              <CustomFormField
                control={form.control}
                name="lastName"
                type="text"
                label="Фамилия"
                placeholder="Введите фамилию"
                required
              />

              <CustomFormField
                control={form.control}
                name="phone"
                type="tel"
                label="Телефон"
                placeholder="+994 742 19 37"
                required
              />

              <CustomFormField
                control={form.control}
                name="contractEndDate"
                type="date"
                label="Дата окончания контракта"
                placeholder="Дата окончания контракта"
                required
              />
            </div>

            {/* Правая колонка */}
            <div className="space-y-6">
              <CustomFormField
                control={form.control}
                name="dailyRate"
                type="number"
                label="Дневная ставка"
                placeholder="15.00"
                step="0.01"
                required
              />

              <CustomFormField
                control={form.control}
                name="currency"
                type="select"
                label="Валюта"
                placeholder="Выберите валюту"
                options={[
                  { value: 'PLN', label: 'PLN' },
                  { value: 'EUR', label: 'EUR' },
                ]}
                required
              />

              <CustomFormField
                control={form.control}
                name="notes"
                type="textarea"
                label="Примечания"
                placeholder="Polish driver with 10 years of experience"
                rows={4}
              />
            </div>
          </div>

          <FormActions
            onCancel={onCancel}
            isLoading={isLoading}
            submitText="Сохранить"
          />
        </form>
      </Form>
    </FormWrapper>
  );
}

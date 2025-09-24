import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, PaymentFormData } from '@/schemas/payment';
import { Form } from '@/components/ui/form';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: PaymentFormData | null;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}) => {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      amount: '',
      paidAmount: '',
      expectedPaymentDate: '',
      actualPaymentDate: '',
      currency: 'EUR',
      notes: '',
    },
  });

  const onFormSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  const pageTitle = initialData ? 'Редактировать платеж' : 'Создать платеж';

  const currencyOptions = [
    { value: 'USD', label: 'USD' },

    { value: 'PLN', label: 'PLN' },
  ];

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Даты */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="expectedPaymentDate"
              type="date"
              label="Ожидаемая дата оплаты"
              placeholder="Ожидаемая дата оплаты"
              required
            />
            <CustomFormField
              control={form.control}
              name="actualPaymentDate"
              type="date"
              label="Фактическая дата оплаты"
              placeholder="Фактическая дата оплаты"
              required
            />
          </div>

          {/* Суммы */}
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
              name="paidAmount"
              type="number"
              label="Оплаченная сумма"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          {/* Валюта и примечание */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="currency"
              type="select"
              label="Валюта"
              placeholder="Выберите валюту"
              options={currencyOptions}
              required
            />
            <CustomFormField
              control={form.control}
              name="notes"
              type="textarea"
              label="Примечание"
              placeholder="Дополнительные примечания..."
              rows={4}
            />
          </div>

          <FormActions
            onCancel={onCancel}
            isLoading={isLoading}
            submitText="Сохранить платеж"
          />
        </form>
      </Form>
    </FormWrapper>
  );
};

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { PaymentFormData } from '@/schemas/payment';
import { useCreatePayment } from '@/hooks/payments/useCreatePayment';
import toast from 'react-hot-toast';

export default function CreatePayment() {
  const navigate = useNavigate();
  const { freightId } = useParams<{ freightId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentMutation = useCreatePayment();

  const handleSubmit = async (data: PaymentFormData) => {
    if (!freightId) return;
    setIsLoading(true);
    try {
      // Валидация данных
      if (
        !data.amount ||
        !data.paidAmount ||
        !data.expectedPaymentDate ||
        !data.actualPaymentDate ||
        !data.currency
      ) {
        console.error('Missing required fields:', data);
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      const amount = parseFloat(data.amount);
      const paidAmount = parseFloat(data.paidAmount);

      if (isNaN(amount) || isNaN(paidAmount)) {
        console.error('Invalid number values:', {
          amount: data.amount,
          paidAmount: data.paidAmount,
        });
        toast.error('Пожалуйста, введите корректные числовые значения');
        return;
      }

      const paymentData = {
        amount,
        paidAmount,
        expectedPaymentDate: data.expectedPaymentDate,
        actualPaymentDate: data.actualPaymentDate,
        currency: data.currency,
        notes: data.notes || '',
      };

      console.log('Sending payment data:', paymentData);
      console.log('Freight ID:', freightId);

      await createPaymentMutation.mutateAsync({
        freightId,
        payment: paymentData,
      });
      navigate('/payments');
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/payments');
  };

  if (!freightId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Ошибка</div>
          <p className="text-gray-600 mb-4">ID фрахта не найден</p>
          <button
            onClick={() => navigate('/payments')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Вернуться к платежам
          </button>
        </div>
      </div>
    );
  }

  return (
    <PaymentForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || createPaymentMutation.isPending}
    />
  );
}

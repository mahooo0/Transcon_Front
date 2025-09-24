import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriversForm from '@/components/forms/DriversForm';
import { DriverFormData } from '@/schemas/driver';
import { useCreateDriver } from '@/hooks/drivers/useCreateDriver';
import toast from 'react-hot-toast';

export default function CreateDriver() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const createDriverMutation = useCreateDriver();

  const handleSubmit = async (data: DriverFormData) => {
    setIsLoading(true);
    try {
      // Валидация данных
      if (
        !data.firstName ||
        !data.lastName ||
        !data.phone ||
        !data.contractEndDate ||
        !data.dailyRate ||
        !data.currency
      ) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Проверяем, что дневная ставка является числом
      const dailyRate = parseFloat(data.dailyRate);
      if (isNaN(dailyRate) || dailyRate <= 0) {
        toast.error('Пожалуйста, введите корректную дневную ставку');
        return;
      }

      const driverData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        contractEndDate: data.contractEndDate,
        dailyRate: data.dailyRate,
        currency: data.currency,
        notes: data.notes || '',
      };

      await createDriverMutation.mutateAsync(driverData);
      navigate('/drivers');
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error('Ошибка при создании водителя');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/drivers');
  };

  return (
    <DriversForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={createDriverMutation.isPending || isLoading}
    />
  );
}

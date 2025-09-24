import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DriversForm from '@/components/forms/DriversForm';
import { DriverFormData } from '@/schemas/driver';
import { useGetDriverById } from '@/hooks/drivers/useGetDriverById';
import { useUpdateDriver } from '@/hooks/drivers/useUpdateDriver';
import toast from 'react-hot-toast';

export default function EditDriver() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<DriverFormData | null>(null);

  const {
    data: driverResponse,
    isLoading: isLoadingDriver,
    error: driverError,
  } = useGetDriverById(id);
  const updateDriverMutation = useUpdateDriver();

  useEffect(() => {
    if (driverResponse?.data) {
      const driver = driverResponse.data;
      setInitialData({
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone,
        contractEndDate: driver.contractEndDate,
        dailyRate: driver.dailyRate,
        currency: driver.currency,
        notes: driver.notes || '',
      });
    }
  }, [driverResponse]);

  const handleSubmit = async (data: DriverFormData) => {
    if (!id) return;

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

      await updateDriverMutation.mutateAsync({ id, data: driverData });
      navigate('/drivers');
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Ошибка при обновлении водителя');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/drivers');
  };

  if (isLoadingDriver) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Загрузка данных водителя...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (driverError) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              Ошибка загрузки данных водителя
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Водитель не найден</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DriversForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={updateDriverMutation.isPending || isLoading}
    />
  );
}

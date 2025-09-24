import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreightForm } from '@/components/forms/FreightForm';
import { FreightFormData } from '@/schemas/freight';
import FreightService from '@/services/freights';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function CreateFreight() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Получаем ID текущего пользователя из Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = async (data: FreightFormData) => {
    setIsLoading(true);
    try {
      // Подготавливаем данные для API
      const freightData = {
        truckId: data.truckId,
        trailerId: data.trailerId,
        driverId: data.driverId,
        loadingDate: data.loadingDate,
        unloadingDate: data.unloadingDate,
        loadingCode: data.loadingCode,
        unloadingCode: data.unloadingCode,
        countries: data.countries,
        kilometers: data.kilometers,
        ratePerKm: data.ratePerKm,
        currency: data.currency,
        totalAmount: data.totalAmount,
        contractorString: data.contractorString,
        responsibleLogistId: currentUser.id, // Используем ID текущего пользователя
        logist: data.logist,
        general: data.general,
        expectedPaymentDate: data.expectedPaymentDate,
      };

      console.log('Creating freight:', freightData);

      // Вызываем API для создания груза
      const response = await FreightService.createFreight(freightData);

      if (response.data) {
        toast.success('Груз успешно создан');
        navigate('/freights');
      }
    } catch (error) {
      console.error('Error creating freight:', error);
      toast.error('Ошибка при создании груза');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/freights');
  };

  return (
    <FreightForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

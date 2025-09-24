import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FreightForm } from '@/components/forms/FreightForm';
import { FreightFormData } from '@/schemas/freight';
import { useGetFreightByIdWithCache } from '@/hooks/freights/useGetFreightByIdWithCache';
import FreightService from '@/services/freights';

export default function EditFreight() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<FreightFormData | null>(null);

  // Загружаем данные груза по ID
  const {
    data: freightResponse,
    isLoading: isLoadingFreight,
    error: freightError,
  } = useGetFreightByIdWithCache(id);

  useEffect(() => {
    if (freightResponse?.data) {
      const freight = freightResponse.data;

      // Преобразуем данные груза в формат формы
      const formData: FreightFormData = {
        loadingDate: freight.loadingDate,
        unloadingDate: freight.unloadingDate,
        loadingCode: freight.loadingCode,
        unloadingCode: freight.unloadingCode,
        countries: freight.countries,
        trailerId: freight.trailerId,
        truckId: freight.truckId,
        driverId: freight.driverId,
        kilometers: freight.kilometers,
        ratePerKm: freight.ratePerKm || 0,
        currency: freight.currency as 'PLN' | 'EUR',
        totalAmount: parseFloat(freight.totalAmount),
        contractorString: freight.contractorString,
        logist: freight.logist,
        expectedPaymentDate: freight.expectedPaymentDate,
        general: freight.general,
        status: freight.status || '',
        paymentStatus: freight.paymentStatus || '',
        files: [], // Файлы будут загружены отдельно если нужно
      };

      setInitialData(formData);
    }
  }, [freightResponse]);

  const handleSubmit = async (data: FreightFormData) => {
    if (!id) return;

    setIsLoading(true);
    try {
      // Подготавливаем данные для API (убираем files, так как они не нужны для обновления)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { files: _, ...updateData } = data;

      // Преобразуем totalAmount в строку
      const updateDataWithStringAmount = {
        ...updateData,
        totalAmount: updateData.totalAmount.toString(),
      };

      // Вызываем API для обновления груза
      await FreightService.updateFreight(id, updateDataWithStringAmount);

      // Navigate back to freights list
      navigate('/freights');
    } catch (error) {
      console.error('Error updating freight:', error);
      // TODO: Показать уведомление об ошибке пользователю
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/freights');
  };

  // Показываем загрузку если данные еще не загружены
  if (isLoadingFreight || (!initialData && !freightError)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных груза...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку если не удалось загрузить данные
  if (freightError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка загрузки данных груза</p>
          <button
            onClick={() => navigate('/freights')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Вернуться к списку грузов
          </button>
        </div>
      </div>
    );
  }

  return (
    <FreightForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      initialData={initialData}
    />
  );
}

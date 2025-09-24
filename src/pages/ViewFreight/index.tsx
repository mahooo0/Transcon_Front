import { useParams, useNavigate } from 'react-router-dom';
import { FreightForm } from '@/components/forms/FreightForm';
import { useGetFreightByIdWithCache } from '@/hooks/freights/useGetFreightByIdWithCache';
import { FreightFormData } from '@/schemas/freight';

export default function ViewFreight() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: freightResponse,
    isLoading,
    error,
  } = useGetFreightByIdWithCache(id!);

  const freightData = freightResponse?.data;

  const handleCancel = () => {
    navigate('/freights');
  };

  // Преобразуем данные груза в формат формы
  const formData: FreightFormData | null = freightData
    ? {
        truckId: freightData.truck?.id || '',
        trailerId: freightData.trailer?.id || '',
        driverId: freightData.driver?.id || '',
        loadingDate: freightData.loadingDate || '',
        unloadingDate: freightData.unloadingDate || '',
        loadingCode: freightData.loadingCode || '',
        unloadingCode: freightData.unloadingCode || '',
        countries: freightData.countries || '',
        kilometers: freightData.kilometers || 0,
        ratePerKm: freightData.ratePerKm || 0,
        currency: (freightData.currency || 'EUR') as 'PLN' | 'EUR',
        totalAmount:
          typeof freightData.totalAmount === 'string'
            ? parseFloat(freightData.totalAmount)
            : freightData.totalAmount || 0,
        contractorString: freightData.contractorString || '',
        logist: freightData.logist || '',
        general: freightData.general || '',
        expectedPaymentDate: freightData.expectedPaymentDate || '',
        files: [], // Файлы не загружаются в режиме просмотра
      }
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Загрузка данных груза...</div>
      </div>
    );
  }

  if (error || !freightData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-lg text-red-600">Ошибка загрузки данных груза</div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Вернуться к списку грузов
        </button>
      </div>
    );
  }

  return (
    <FreightForm
      initialData={formData}
      onSubmit={() => {}} // Пустая функция, так как форма в режиме просмотра
      onCancel={handleCancel}
      isLoading={false}
      isViewMode={true} // Передаем флаг режима просмотра
    />
  );
}

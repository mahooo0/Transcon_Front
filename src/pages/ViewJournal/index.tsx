import { useParams, useNavigate } from 'react-router-dom';
import JournalForm from '@/components/forms/JournalForm';
import { useGetIncidentLogByIdWithCache } from '@/hooks/incident-logs/useGetIncidentLogByIdWithCache';
import { useGetFreights } from '@/hooks/freights/useGetFreights';
import { JournalFormData } from '@/schemas/journal';

export default function ViewJournal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: incidentLogResponse,
    isLoading,
    error,
  } = useGetIncidentLogByIdWithCache(id!);

  // Загружаем список фрахтов для отображения
  const { data: freightsResponse, isLoading: isLoadingFreights } =
    useGetFreights({
      limit: 1000,
    });

  const incidentLogData = incidentLogResponse?.data;
  const freightsData = freightsResponse?.data?.data || [];

  const handleCancel = () => {
    navigate('/journal');
  };

  // Преобразуем данные записи журнала в формат формы
  const formData: Partial<JournalFormData> | undefined = incidentLogData
    ? {
        freightId: incidentLogData.freight?.id || '',
        incidentDate: incidentLogData.incidentDate || '',
        incidentType: incidentLogData.incidentType || '',
        culprit: '', // Поле не используется в API
        incidentDescription: incidentLogData.description || '',
        // financialBurden: incidentLogData.financialBurden || '', // Поле не используется в форме
        amount:
          typeof incidentLogData.amount === 'number'
            ? String(incidentLogData.amount)
            : incidentLogData.amount || '0',
        currency: incidentLogData.currency || 'EUR',
        note: incidentLogData.notes || '',
        documents: [], // Файлы не загружаются в режиме просмотра
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">
          Загрузка данных записи журнала...
        </div>
      </div>
    );
  }

  if (error || !incidentLogData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-lg text-red-600">
          Ошибка загрузки данных записи журнала
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Вернуться к журналу
        </button>
      </div>
    );
  }

  return (
    <JournalForm
      initialData={formData}
      onSubmit={() => {}} // Пустая функция, так как форма в режиме просмотра
      onCancel={handleCancel}
      isLoading={false}
      freights={freightsData}
      isLoadingFreights={isLoadingFreights}
      isViewMode={true} // Передаем флаг режима просмотра
    />
  );
}

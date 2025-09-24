import JournalForm from '@/components/forms/JournalForm';
import { JournalFormData } from '@/schemas/journal';
import { useNavigate } from 'react-router-dom';
import { useCreateIncidentLog } from '@/hooks/incident-logs/useCreateIncidentLog';
import { useGetFreights } from '@/hooks/freights/useGetFreights';
import { CreateIncidentLogDto } from '@/services/incident-logs/types';

export default function CreateJournal() {
  const navigate = useNavigate();
  const createIncidentLogMutation = useCreateIncidentLog();

  // Загружаем список фрахтов для селекта
  const { data: freightsResponse, isLoading: isLoadingFreights } =
    useGetFreights({ limit: 1000 }); // Загружаем много фрахтов для селекта

  const freightsData = freightsResponse?.data?.data || [];

  const handleSubmit = async (data: JournalFormData) => {
    try {
      console.log('Отправка формы журнала:', data);

      // Маппинг типов происшествий из формы в API
      const incidentTypeMapping: Record<
        string,
        'FUEL' | 'FINE' | 'REPAIR' | 'ADDITIONAL' | 'ROAD'
      > = {
        ACCIDENT: 'REPAIR',
        THEFT: 'ADDITIONAL',
        DAMAGE: 'REPAIR',
        VIOLATION: 'FINE',
        OTHER: 'ADDITIONAL',
      };

      // Маппинг виновников из формы в API
      const financialBurdenMapping: Record<string, 'ON_DRIVER' | 'ON_COMPANY'> =
        {
          DRIVER: 'ON_DRIVER',
          COMPANY: 'ON_COMPANY',
          THIRD_PARTY: 'ON_COMPANY',
          FORCE_MAJEURE: 'ON_COMPANY',
        };

      // Преобразуем данные формы в формат API
      const incidentLogData: CreateIncidentLogDto = {
        freightId: data.freightId || '',
        incidentDate: data.incidentDate,
        incidentType: incidentTypeMapping[data.incidentType] || 'ADDITIONAL',
        description: data.incidentDescription,
        financialBurden: financialBurdenMapping[data.culprit] || 'ON_COMPANY',
        amount: parseFloat(data.amount),
        currency: data.currency,
        notes: data.note || '',
      };

      console.log('Данные для API:', incidentLogData);

      await createIncidentLogMutation.mutateAsync(incidentLogData);

      // После успешного создания переходим обратно к списку
      navigate('/journal');
    } catch (error) {
      console.error('Ошибка при создании записи журнала:', error);
    }
  };

  const handleCancel = () => {
    navigate('/journal');
  };

  return (
    <JournalForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={createIncidentLogMutation.isPending}
      freights={freightsData}
      isLoadingFreights={isLoadingFreights}
    />
  );
}

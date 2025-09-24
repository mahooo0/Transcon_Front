import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JournalForm from '@/components/forms/JournalForm';
import { JournalFormData } from '@/schemas/journal';
import { useGetIncidentLogByIdWithCache } from '@/hooks/incident-logs/useGetIncidentLogByIdWithCache';
import { useUpdateIncidentLog } from '@/hooks/incident-logs/useUpdateIncidentLog';
import { useGetFreights } from '@/hooks/freights/useGetFreights';

export default function EditJournal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<JournalFormData | null>(null);

  const {
    data: incidentLogResponse,
    isLoading: isLoadingIncidentLog,
    error: incidentLogError,
  } = useGetIncidentLogByIdWithCache(id);

  const { data: freightsResponse, isLoading: isLoadingFreights } =
    useGetFreights({ limit: 1000 });

  const freightsData = freightsResponse?.data?.data || [];

  const updateIncidentLogMutation = useUpdateIncidentLog();

  useEffect(() => {
    if (incidentLogResponse?.data) {
      const incidentLog = incidentLogResponse.data;

      // Обратный маппинг типов происшествий из API в форму
      const reverseIncidentTypeMapping: Record<string, string> = {
        FUEL: 'OTHER',
        FINE: 'VIOLATION',
        REPAIR: 'ACCIDENT',
        ADDITIONAL: 'THEFT',
        ROAD: 'OTHER',
      };

      // Обратный маппинг виновников из API в форму
      const reverseFinancialBurdenMapping: Record<string, string> = {
        ON_DRIVER: 'DRIVER',
        ON_COMPANY: 'COMPANY',
      };

      const formData: JournalFormData = {
        freightId: incidentLog.freightId,
        freight: `${incidentLog.freight.loadingCode} - ${incidentLog.freight.countries}`,
        incidentDate: incidentLog.incidentDate,
        incidentType:
          reverseIncidentTypeMapping[incidentLog.incidentType] || 'OTHER',
        incidentDescription: incidentLog.description,
        culprit:
          reverseFinancialBurdenMapping[incidentLog.financialBurden] ||
          'COMPANY',
        amount: incidentLog.amount,
        currency: incidentLog.currency,
        note: incidentLog.notes,
      };
      setInitialData(formData);
    }
  }, [incidentLogResponse]);

  const handleSubmit = async (data: JournalFormData) => {
    if (!id) return;
    setIsLoading(true);
    try {
      console.log('Обновление записи журнала:', data);

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

      const incidentLogData = {
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

      await updateIncidentLogMutation.mutateAsync({
        id,
        data: incidentLogData,
      });
      navigate('/journal');
    } catch (error) {
      console.error('Error updating incident log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/journal');
  };

  if (isLoadingIncidentLog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка записи журнала...</p>
        </div>
      </div>
    );
  }

  if (incidentLogError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Ошибка загрузки</div>
          <p className="text-gray-600 mb-4">
            Не удалось загрузить запись журнала
          </p>
          <button
            onClick={() => navigate('/journal')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Вернуться к журналу
          </button>
        </div>
      </div>
    );
  }

  return (
    <JournalForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading || updateIncidentLogMutation.isPending}
      initialData={initialData || undefined}
      freights={freightsData}
      isLoadingFreights={isLoadingFreights}
    />
  );
}

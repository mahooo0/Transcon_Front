import {
  Form,

} from '@/components/ui/form';
import { useTrailerForm } from '@/hooks/trailers/useTrailerForm';
import { useParams, useNavigate } from 'react-router-dom';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

const TrailersForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    form,
    onSubmit,
    isSubmitting,
    statusOptions,
    isLoadingTrailer,
    trailerError,
  } = useTrailerForm({ id, isEdit });

  const handleCancel = () => {
    navigate('/transport/trailers');
  };

  const pageTitle = isEdit ? 'Редактировать прицеп' : 'Добавить прицеп';
  const submitButtonText = isEdit ? 'Обновить прицеп' : 'Добавить прицеп';

  // Обработка состояний загрузки и ошибок для редактирования
  if (isEdit && isLoadingTrailer) {
    return (
      <FormWrapper title={pageTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-slate-600">
              Загрузка данных прицепа...
            </span>
          </div>
        </div>
      </FormWrapper>
    );
  }

  if (isEdit && trailerError) {
    return (
      <FormWrapper title={pageTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Ошибка при загрузке данных прицепа: {trailerError.message}
          </div>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Номер прицепа и VIN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="registrationNumber"
              type="text"
              label="Номер прицепа"
              placeholder="ABC1234"
              required
            />
            <CustomFormField
              control={form.control}
              name="vinNumber"
              type="text"
              label="VIN номер"
              placeholder="1HGCM82633A004352"
              required
            />
          </div>

          {/* Статус */}
          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="status"
              type="select"
              label="Статус"
              placeholder="Выберите статус"
              options={statusOptions}
              required
            />
          </div>

          {/* Страховка */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="insuranceFrom"
              type="date"
              label="Страховка от"
              placeholder="Дата начала страховки"
              required
            />
            <CustomFormField
              control={form.control}
              name="insuranceTo"
              type="date"
              label="Страховка до"
              placeholder="Дата окончания страховки"
              required
            />
          </div>

          {/* Техосмотр */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="technicalInspectionFrom"
              type="date"
              label="Техосмотр от"
              placeholder="Дата начала техосмотра"
              required
            />
            <CustomFormField
              control={form.control}
              name="technicalInspectionTo"
              type="date"
              label="Техосмотр до"
              placeholder="Дата окончания техосмотра"
              required
            />
          </div>

          {/* Примечания */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="notes_ru"
              type="textarea"
              label="Примечание (на русском)"
              placeholder="Введите примечания на русском языке..."
              rows={4}
            />
            <CustomFormField
              control={form.control}
              name="notes_pl"
              type="textarea"
              label="Примечание (на польском)"
              placeholder="Wprowadź notatki w języku polskim..."
              rows={4}
            />
          </div>

          <FormActions
            onCancel={handleCancel}
            isLoading={isSubmitting}
            submitText={submitButtonText}
          />
        </form>
      </Form>
    </FormWrapper>
  );
};

export default TrailersForm;

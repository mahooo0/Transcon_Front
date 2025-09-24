import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import FileUpload from '@/components/ui/file-upload';
import { useTruckForm } from '@/hooks/trucks/useTruckForm';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

const TrucksForm = () => {
  const {
    form,
    photos,
    pageTitle,
    submitButtonText,
    statusOptions,
    handlePhotoUpload,
    removePhoto,
    onSubmit,
    handleCancel,
    isLoadingTruck,
    truckError,
  } = useTruckForm();

  // Отображение состояния загрузки при редактировании
  if (isLoadingTruck) {
    return (
      <FormWrapper title={pageTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-slate-600">
              Загрузка данных грузовика...
            </span>
          </div>
        </div>
      </FormWrapper>
    );
  }

  // Отображение ошибки при загрузке
  if (truckError) {
    return (
      <FormWrapper title={pageTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Ошибка при загрузке данных: {truckError.message}
          </div>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Номер авто и Марка */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="registrationNumber"
              type="text"
              label="Номер авто"
              placeholder="AB22Cww1903"
              required
            />
            <CustomFormField
              control={form.control}
              name="brand"
              type="text"
              label="Марка"
              placeholder="Alpay-2024"
              required
            />
          </div>

          {/* Модель и VIN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="model"
              type="text"
              label="Модель"
              placeholder="X4"
              required
            />
            <CustomFormField
              control={form.control}
              name="vinNumber"
              type="text"
              label="Номер VIN"
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
              placeholder="Введите примечания на русском..."
              rows={4}
            />
            <CustomFormField
              control={form.control}
              name="notes_pl"
              type="textarea"
              label="Примечание (на польском)"
              placeholder="Wprowadź uwagi po polsku..."
              rows={4}
            />
          </div>

          {/* Фото документов */}
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6 bg-white/50">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Фото документов
              </h3>
              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handlePhotoUpload}
                        onRemoveFile={removePhoto}
                        accept="image/*"
                        multiple={true}
                        maxFiles={7}
                        currentFilesCount={photos.length}
                        label="Фото документов"
                        files={photos}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormActions onCancel={handleCancel} submitText={submitButtonText} />
        </form>
      </Form>
    </FormWrapper>
  );
};

export default TrucksForm;

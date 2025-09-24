import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import FileUpload from '@/components/ui/file-upload';
import { useExtraTransportForm } from '@/hooks/extraTransport/useExtraTransportForm';
import FormWrapper from '@/components/common/FormWrapper';
import FormActions from '@/components/common/FormActions';
import CustomFormField from '@/components/common/FormField';

const ExtraTransportForm = () => {
  const {
    form,
    photos,
    isLoading,
    isSubmitting,
    pageTitle,
    submitButtonText,
    handlePhotoUpload,
    removePhoto,
    onSubmit,
    handleCancel,
  } = useExtraTransportForm();

  if (isLoading) {
    return (
      <FormWrapper title={pageTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-slate-600">Загрузка данных...</span>
          </div>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title={pageTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              name="registrationNumber"
              type="text"
              label="Регистрационный номер"
              placeholder="00AA000"
              required
            />
            <CustomFormField
              control={form.control}
              name="name"
              type="text"
              label="Название"
              placeholder="Введите название транспорта"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="type"
              type="text"
              label="Тип"
              placeholder="Введите тип транспорта"
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

          {/* Примечание */}
          <div className="grid grid-cols-1 gap-6">
            <CustomFormField
              control={form.control}
              name="notes"
              type="textarea"
              label="Примечание"
              placeholder="Введите примечания..."
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

export default ExtraTransportForm;

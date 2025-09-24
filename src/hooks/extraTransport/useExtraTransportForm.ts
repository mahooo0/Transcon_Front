import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createExtraTransportSchema,
  ExtraTransportFormData,
  updateExtraTransportSchema,
} from '@/schemas/extraTransport';
import {
  useGetExtraTransportById,
  useCreateExtraTransport,
  useUpdateExtraTransport,
} from './use-api-extra-transposrt';
import React from 'react';

// Функция для форматирования даты в YYYY-MM-DD
const formatDateForAPI = (dateString: string | undefined): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0]; // Возвращает YYYY-MM-DD
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const useExtraTransportForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [photos, setPhotos] = useState<File[]>([]);
  const navigate = useNavigate();

  // Получаем данные для редактирования
  const { data: extraTransport, isLoading } = useGetExtraTransportById(
    id || ''
  );

  // Хуки для создания и обновления
  const createMutation = useCreateExtraTransport();
  const updateMutation = useUpdateExtraTransport();

  const validationSchema = isEdit
    ? updateExtraTransportSchema
    : createExtraTransportSchema;

  const defaultValues: Partial<ExtraTransportFormData> = {
    registrationNumber: extraTransport?.data?.registrationNumber || '',
    name: extraTransport?.data?.name || '',
    type: extraTransport?.data?.type || '',
    insuranceFrom: extraTransport?.data?.insuranceFrom || '',
    insuranceTo: extraTransport?.data?.insuranceTo || '',
    technicalInspectionFrom:
      extraTransport?.data?.technicalInspectionFrom || '',
    technicalInspectionTo: extraTransport?.data?.technicalInspectionTo || '',
    notes: extraTransport?.data?.notes || '',
    photos: [],
  };

  const form = useForm<ExtraTransportFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  // Обновляем значения формы когда данные загружены
  React.useEffect(() => {
    if (isEdit && extraTransport?.data) {
      console.log('Loading extra transport data:', extraTransport.data);
      form.reset({
        registrationNumber: extraTransport.data.registrationNumber || '',
        name: extraTransport.data.name || '',
        type: extraTransport.data.type || '',
        insuranceFrom: extraTransport.data.insuranceFrom || '',
        insuranceTo: extraTransport.data.insuranceTo || '',
        technicalInspectionFrom:
          extraTransport.data.technicalInspectionFrom || '',
        technicalInspectionTo: extraTransport.data.technicalInspectionTo || '',
        notes: extraTransport.data.notes || '',
        photos: [],
      });
    }
  }, [extraTransport, isEdit, form]);

  const handlePhotoUpload = (files: FileList | null) => {
    if (files && photos.length < 7) {
      const newPhotos = Array.from(files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 7));
      form.setValue('photos', [...photos, ...newPhotos].slice(0, 7));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    form.setValue('photos', newPhotos);
    console.log('Removed photo at index:', index, 'New photos:', newPhotos);
  };

  const onSubmit = async (values: ExtraTransportFormData) => {
    try {
      console.log('Form submission started');
      console.log('Form values:', values);
      console.log('Form errors:', form.formState.errors);

      // Подготавливаем данные в формате API с правильным форматированием дат
      const apiData = {
        registrationNumber: values.registrationNumber,
        name: values.name,
        type: values.type,
        insuranceFrom: formatDateForAPI(values.insuranceFrom),
        insuranceTo: formatDateForAPI(values.insuranceTo),
        technicalInspectionFrom: formatDateForAPI(
          values.technicalInspectionFrom
        ),
        technicalInspectionTo: formatDateForAPI(values.technicalInspectionTo),
        notes: values.notes || '',
      };

      console.log('API Request Body:', apiData);
      console.log('All form fields:');
      console.log('- Регистрационный номер:', values.registrationNumber);
      console.log('- Название:', values.name);
      console.log('- Тип:', values.type);
      console.log('- Страховка от:', values.insuranceFrom);
      console.log('- Страховка до:', values.insuranceTo);
      console.log('- Техосмотр от:', values.technicalInspectionFrom);
      console.log('- Техосмотр до:', values.technicalInspectionTo);
      console.log('- Примечание:', values.notes);
      console.log('- Фото документов:', values.photos);

      // Вызываем соответствующую мутацию
      if (isEdit && id) {
        console.log('Updating extra transport with ID:', id);
        await updateMutation.mutateAsync({ id, data: apiData });
      } else {
        console.log('Creating new extra transport');
        await createMutation.mutateAsync(apiData);
      }
    } catch (error) {
      console.error('Error saving extra transport:', error);
      // Ошибки обрабатываются в хуках мутаций
    }
  };

  const handleCancel = () => {
    navigate('/transport/extra');
  };

  const pageTitle = isEdit
    ? 'Редактировать дополнительный транспорт'
    : 'Добавить дополнительный транспорт';
  const submitButtonText = isEdit ? 'Обновить' : 'Создать';

  return {
    form,
    photos,
    isEdit,
    isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    pageTitle,
    submitButtonText,
    handlePhotoUpload,
    removePhoto,
    onSubmit,
    handleCancel,
  };
};

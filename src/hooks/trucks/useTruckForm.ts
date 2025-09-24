import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createTruckSchema,
  TruckFormData,
  updateTruckSchema,
} from '@/schemas/truck';
import { useCreateTruck } from './useCreateTruck';
import { useUpdateTruck } from './useUpdateTruck';
import { useGetTruckById } from './useGetTruckById';
import { Trucks } from '@/services/trucks/types';

// Функция для преобразования данных API в формат формы
const mapTruckToFormData = (truck: Trucks): Partial<TruckFormData> => {
  return {
    registrationNumber: truck.registrationNumber,
    brand: truck.brand,
    model: truck.model,
    vinNumber: truck.vinNumber,
    status: truck.status,
    insuranceFrom: truck.insuranceFrom,
    insuranceTo: truck.insuranceTo,
    technicalInspectionFrom: truck.technicalInspectionFrom,
    technicalInspectionTo: truck.technicalInspectionTo,
    notes_ru: truck.notes?.ru || '',
    notes_pl: truck.notes?.pl || '',
    photos: [], // фото загружаются отдельно
  };
};

export const useTruckForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [photos, setPhotos] = useState<File[]>([]);
  const navigate = useNavigate();
  const createTruck = useCreateTruck();
  const updateTruck = useUpdateTruck();
  const validationSchema = isEdit ? updateTruckSchema : createTruckSchema;

  // Получаем данные грузовика для редактирования
  const {
    data: truckData,
    isLoading: isLoadingTruck,
    error: truckError,
  } = useGetTruckById(id);

  const defaultValues: Partial<TruckFormData> = {
    registrationNumber: '',
    brand: '',
    model: '',
    vinNumber: '',
    status: 'ON_BASE',
    insuranceFrom: '',
    insuranceTo: '',
    technicalInspectionFrom: '',
    technicalInspectionTo: '',
    notes_ru: '',
    notes_pl: '',
    photos: [],
  };

  const form = useForm<TruckFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  // Загружаем данные в форму при редактировании
  useEffect(() => {
    if (isEdit && truckData) {
      console.log('Loading truck data into form:', truckData);
      const formData = mapTruckToFormData(truckData);
      console.log('Mapped form data:', formData);

      // Устанавливаем значения в форму
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof TruckFormData, value);
        }
      });

      // Устанавливаем фото если есть
      if (truckData.documents && truckData.documents.length > 0) {
        // TODO: Обработать документы/фото из API
        console.log('Truck documents:', truckData.documents);
      }
    }
  }, [isEdit, truckData, form]);

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

  const onSubmit = async (values: TruckFormData) => {
    try {
      console.log('Truck form values:', values);
      console.log('All form fields:');
      console.log('- Номер авто:', values.registrationNumber);
      console.log('- Марка:', values.brand);
      console.log('- Модель:', values.model);
      console.log('- VIN:', values.vinNumber);
      console.log('- Статус:', values.status);
      console.log('- Страховка от:', values.insuranceFrom);
      console.log('- Страховка до:', values.insuranceTo);
      console.log('- Техосмотр от:', values.technicalInspectionFrom);
      console.log('- Техосмотр до:', values.technicalInspectionTo);
      console.log('- Примечание RU:', values.notes_ru);
      console.log('- Примечание PL:', values.notes_pl);
      console.log('- Фото документов:', values.photos);

      // Подготавливаем данные для API
      const truckData = {
        registrationNumber: values.registrationNumber,
        brand: values.brand,
        model: values.model,
        vinNumber: values.vinNumber,
        insuranceFrom: values.insuranceFrom,
        insuranceTo: values.insuranceTo,
        technicalInspectionFrom: values.technicalInspectionFrom,
        technicalInspectionTo: values.technicalInspectionTo,
        notes: {
          ru: values.notes_ru || '',
          pl: values.notes_pl || '',
        },
        status: values.status,
      };

      if (isEdit && id) {
        await updateTruck.mutateAsync({ id, truckData });
      } else {
        await createTruck.mutateAsync(truckData);
      }

      toast.success(
        isEdit ? 'Грузовик успешно обновлен' : 'Грузовик успешно создан'
      );

      navigate('/transport/trucks');
    } catch (error) {
      console.error('Error saving truck:', error);
      toast.error('Ошибка при сохранении грузовика');
    }
  };

  const handleCancel = () => {
    navigate('/transport/trucks');
  };

  const pageTitle = isEdit ? 'Редактировать грузовик' : 'Добавить грузовик';
  const submitButtonText = isEdit ? 'Обновить' : 'Создать';

  const statusOptions = [
    { value: 'IN_ROUTE', label: 'В РЕЙСЕ' },
    { value: 'ON_BASE', label: 'На базе' },
    { value: 'IN_REPAIR', label: 'В ремонте' },
  ];

  return {
    form,
    photos,
    isEdit,
    pageTitle,
    submitButtonText,
    statusOptions,
    handlePhotoUpload,
    removePhoto,
    onSubmit,
    handleCancel,
    // Состояния загрузки для редактирования
    isLoadingTruck,
    truckError,
  };
};

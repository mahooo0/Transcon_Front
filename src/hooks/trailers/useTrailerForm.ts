import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { trailerSchema, TrailerFormData } from '@/schemas/trailer';
import { useCreateTrailer } from './useCreateTrailer';
import { useUpdateTrailer } from './useUpdateTrailer';
import { useGetTrailerById } from './useGetTrailerById';
import { Trailer } from '@/services/trailers/types';
import { CreateTrailerDto } from '@/services/trailers/types';

interface UseTrailerFormProps {
  id?: string;
  isEdit?: boolean;
}

// Функция для маппинга данных API в формат формы
const mapTrailerToFormData = (trailer: Trailer): TrailerFormData => {
  return {
    registrationNumber: trailer.registrationNumber,
    vinNumber: trailer.vinNumber,
    insuranceFrom: trailer.insuranceFrom,
    insuranceTo: trailer.insuranceTo,
    technicalInspectionFrom: trailer.technicalInspectionFrom,
    technicalInspectionTo: trailer.technicalInspectionTo,
    notes_ru: trailer.notes?.ru || '',
    notes_pl: trailer.notes?.pl || '',
    status: trailer.status,
  };
};

export const useTrailerForm = ({
  id,
  isEdit = false,
}: UseTrailerFormProps = {}) => {
  const navigate = useNavigate();
  const createTrailer = useCreateTrailer();
  const updateTrailer = useUpdateTrailer();

  // Получаем данные прицепа для редактирования
  const {
    data: trailerData,
    isLoading: isLoadingTrailer,
    error: trailerError,
  } = useGetTrailerById(isEdit ? id : undefined);

  // Дефолтные значения формы
  const defaultValues: TrailerFormData = {
    registrationNumber: '',
    vinNumber: '',
    insuranceFrom: '',
    insuranceTo: '',
    technicalInspectionFrom: '',
    technicalInspectionTo: '',
    notes_ru: '',
    notes_pl: '',
    status: 'ON_BASE',
  };

  const form = useForm({
    resolver: zodResolver(trailerSchema),
    defaultValues,
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (isEdit && trailerData) {
      console.log('Setting form data for editing:', trailerData);
      const formData = mapTrailerToFormData(trailerData);
      console.log('Mapped form data:', formData);

      // Устанавливаем значения формы
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as keyof TrailerFormData, value);
      });
    }
  }, [isEdit, trailerData, form]);

  const onSubmit = async (data: TrailerFormData) => {
    console.log('Form submitted with data:', data);

    try {
      // Подготавливаем данные для API
      const trailerData: CreateTrailerDto = {
        registrationNumber: data.registrationNumber,
        vinNumber: data.vinNumber,
        insuranceFrom: data.insuranceFrom,
        insuranceTo: data.insuranceTo,
        technicalInspectionFrom: data.technicalInspectionFrom,
        technicalInspectionTo: data.technicalInspectionTo,
        notes: {
          ru: data.notes_ru || '',
          pl: data.notes_pl || '',
        },
        status: data.status,
      };

      console.log('Prepared API data:', trailerData);

      if (isEdit && id) {
        console.log('Updating trailer with ID:', id);
        await updateTrailer.mutateAsync({ id, trailerData });
        toast.success('Прицеп успешно обновлен');
      } else {
        console.log('Creating new trailer');
        await createTrailer.mutateAsync(trailerData);
        toast.success('Прицеп успешно создан');
      }

      // Переходим к списку прицепов
      navigate('/transport/trailers');
    } catch (error) {
      console.error('Error submitting trailer form:', error);
      const errorMessage = isEdit
        ? 'Ошибка при обновлении прицепа'
        : 'Ошибка при создании прицепа';
      toast.error(errorMessage);
    }
  };

  const statusOptions = [
    { value: 'IN_ROUTE', label: 'В РЕЙСЕ' },
    { value: 'ON_BASE', label: 'На базе' },
    { value: 'IN_REPAIR', label: 'В ремонте' },
  ];

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: createTrailer.isPending || updateTrailer.isPending,
    statusOptions,
    // Для редактирования
    isLoadingTrailer,
    trailerError,
  };
};

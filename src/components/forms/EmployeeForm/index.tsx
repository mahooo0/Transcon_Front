import PageHeader from '@/components/common/PageHeader';
import {
  createEmployeeSchema,
  FormData,
  profileSchema,
  updateEmployeeSchema,
} from '@/schemas/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGetRoles } from '@/hooks/useGetRoles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserRole, SUPPORTED_LANGUAGES } from '@/helpers';
import { useCreateEmployee } from '@/hooks/employees/useCreateEmployee';
import { useUpdateEmployee } from '@/hooks/employees/useUpdateEmployee';
import { useUpdateEmployeeProfile } from '@/hooks/employees/useUpdateEmployeeProfile'; // Новый хук
import { Textarea } from '@/components/ui/textarea';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateEmployeeProfileDto,
} from '@/services/employees/types';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetEmployee } from '@/hooks/employees/useGetEmployee';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/redux/typeHooks';
import { RootState } from '@/redux/store';
import { UserRole } from '@/types/enum';

const EmployeeForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { user } = useAppSelector((state: RootState) => state.auth);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isEditingOwnProfile = isEdit && !isSuperAdmin && user?.id === id;
  const isFullEdit = isSuperAdmin;

  const getValidationSchema = () => {
    if (!isEdit) return createEmployeeSchema;
    if (isEditingOwnProfile) return profileSchema;
    return updateEmployeeSchema;
  };

  const validationSchema = getValidationSchema();

  //! Query Hooks
  const { data: roles } = useGetRoles();
  const { data: employee, isLoading: isLoadingEmployee } = useGetEmployee(
    id ?? ''
  );
  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();
  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();
  const { mutateAsync: updateEmployeeProfile, isPending: isUpdatingProfile } =
    useUpdateEmployeeProfile();

  const navigate = useNavigate();

  const defaultValues: Partial<FormData> = {
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    login: '',
    password: '',
    roleId: '',
    notes: {
      pl: '',
      ru: '',
    },
  };

  //Todo: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  console.log('Response employee', employee);

  useEffect(() => {
    if (employee && isEdit) {
      if (isEditingOwnProfile) {
        form.reset({
          phone: employee.phone || '',
          notes: {
            pl: employee.notes?.pl || '',
            ru: employee.notes?.ru || '',
          },
        });
      } else if (isFullEdit) {
        form.reset({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          position: employee.position || '',
          phone: employee.phone || '',
          login: employee.login || '',
          password: '',
          roleId: employee.role?.id || '',
          notes: {
            pl: employee.notes?.pl || '',
            ru: employee.notes?.ru || '',
          },
        });
      }
    }
  }, [employee, isEdit, isEditingOwnProfile, isFullEdit, form]);
  //Todo: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: any) {
    try {
      if (isEdit && id) {
        if (isEditingOwnProfile) {
          const profileData: UpdateEmployeeProfileDto = {
            phone: values.phone,
            notes: values.notes,
          };

          await updateEmployeeProfile({ id, profileData });
          toast.success('Профиль успешно обновлен');
        } else if (isFullEdit) {
          const updateData: UpdateEmployeeDto = {};

          if (values.firstName) updateData.firstName = values.firstName;
          if (values.lastName) updateData.lastName = values.lastName;
          if (values.position) updateData.position = values.position;
          if (values.phone !== undefined) updateData.phone = values.phone;
          if (values.login) updateData.login = values.login;
          if (values.roleId) updateData.roleId = values.roleId;
          if (values.notes) updateData.notes = values.notes;

          if (values.password && values.password.trim() !== '') {
            updateData.password = values.password;
          }

          await updateEmployee({ id, employeeData: updateData });
          toast.success('Сотрудник успешно обновлен');
        }
      } else {
        if (!isSuperAdmin) {
          toast.error('Недостаточно прав для создания сотрудника');
          return;
        }

        const createData: CreateEmployeeDto = {
          firstName: values.firstName,
          lastName: values.lastName,
          position: values.position,
          phone: values.phone,
          login: values.login,
          password: values.password,
          roleId: values.roleId,
          notes: values.notes,
        };

        await createEmployee(createData);
        toast.success('Сотрудник успешно создан');
      }

      navigate('/employees');
    } catch (error) {
      console.error(
        `Error ${isEdit ? 'updating' : 'creating'} employee:`,
        error
      );
      toast.error(
        `Ошибка при ${isEdit ? 'обновлении' : 'создании'} ${
          isEditingOwnProfile ? 'профиля' : 'сотрудника'
        }`
      );
    }
  }

  if (isEdit && !isSuperAdmin && !isEditingOwnProfile) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Нет доступа</h2>
          <p className="text-gray-600">
            У вас нет прав для редактирования этого сотрудника
          </p>
          <Button onClick={() => navigate('/employees')} className="mt-4">
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  if (!isEdit && !isSuperAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Нет доступа</h2>
          <p className="text-gray-600">
            Только SuperAdmin может создавать сотрудников
          </p>
          <Button onClick={() => navigate('/employees')} className="mt-4">
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  if (isEdit && isLoadingEmployee) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 color="#000" className="animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    if (!isEdit) return 'Добавить сотрудника';
    if (isEditingOwnProfile) return 'Редактировать профиль';
    return 'Редактировать сотрудника';
  };

  const getSubmitButtonText = () => {
    if (!isEdit) return 'Создать';
    if (isEditingOwnProfile) return 'Обновить профиль';
    return 'Обновить';
  };

  const pageTitle = getPageTitle();
  const submitButtonText = getSubmitButtonText();
  const isSubmitting = isCreating || isUpdating || isUpdatingProfile;

  return (
    <>
      <PageHeader title={pageTitle} goBack={() => navigate('/employees')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Полные поля - только для SuperAdmin и создания */}
          {(isFullEdit || !isEdit) && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фамилия</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Должность</FormLabel>
                      <FormControl>
                        <Input placeholder="Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логин</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Пароль{' '}
                        {isEdit && (
                          <span className="text-gray-500">
                            (оставьте пустым, чтобы не изменять)
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            isEdit
                              ? 'Оставьте пустым, чтобы не изменять'
                              : '*********'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Роль</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите роль" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles &&
                            roles.data.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {getUserRole(role.name)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {isEditingOwnProfile && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+71234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(isFullEdit || !isEdit) && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+71234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <FormField
                key={lang.code}
                control={form.control}
                //Todo: fix any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={`notes.${lang.code}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заметки ({lang.label})</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Введите заметки на ${lang.label.toLowerCase()}...`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/employees')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              variant="primary"
            >
              {isSubmitting ? 'Сохранение...' : submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EmployeeForm;

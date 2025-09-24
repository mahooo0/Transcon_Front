export const FREIGHT_STATUSES = {
  IN_PROGRESS: 'В дороге',
  COMPLETED: 'Закончено',
  PLANNED: 'Запланировано',
  DELAYED: 'Опоздание',
} as const;

export const DRIVER_STATUSES = {
  ON_TRIP: 'В РЕЙСЕ',
  VACATION: 'ОТПУСК',
  PREPARING_DOCS: 'ПОДГОТОВКА ДОК',
  FIRED: 'УВОЛЕН',
} as const;

export const CURRENCIES = {
  PLN: 'PLN',
  EUR: 'EUR',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'СуперАдмин',
  ADMIN: 'Админ',
  SUPER_EMPLOYEE: 'СуперСотрудник',
  EMPLOYEE: 'Сотрудник',
} as const;

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
} as const;
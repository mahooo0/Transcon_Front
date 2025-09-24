import { LoginSchemaType } from '@/schemas/login';
import { UseFormRegister, UseFormReturn } from 'react-hook-form';

export interface ILoginBody {
  login: string;
  password: string;
}

export interface ILoginFormProps {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  register: UseFormRegister<LoginSchemaType>;
}
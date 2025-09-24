import AuthService from '@/services/auth';
import { LoginForm } from './LoginForm';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  setIsAuthenticated,
  setSessionTimeOut,
  setUser,
} from '@/redux/slices/auth/auth.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { LoginSchema, LoginSchemaType } from '@/schemas/login';
import { AxiosError } from 'axios';

const LoginFormContainer = () => {
  const LoginValues = {
    login: '',
    password: '',
  };
  const dispatch = useDispatch();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: LoginValues,
  });

  const handleLogin: SubmitHandler<LoginSchemaType> = async (loginBody) => {
    try {
      const { success, data } = await AuthService.login(loginBody);
      if (success && data) {
        dispatch(setUser(data.user));
        dispatch(setSessionTimeOut(data.session_timeout));
        dispatch(setIsAuthenticated(true));
      }
      toast.success('Login successful');
    } catch (error) {
      const err = error as Error | AxiosError;
      if (err) {
        toast.error(err.message || 'Login failed');
      }
    }
  };

  return (
    <>
      <LoginForm
        form={form}
        register={form.register}
        onSubmit={form.handleSubmit(handleLogin)}
      />
    </>
  );
};

export default LoginFormContainer;

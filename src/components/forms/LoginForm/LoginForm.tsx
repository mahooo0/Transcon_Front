import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ILoginFormProps } from './types';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { User, Lock, LogIn } from 'lucide-react';

export const LoginForm: React.FC<ILoginFormProps> = ({ onSubmit, form }) => {
  return (
    <div className="w-full">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Вход в систему
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Введите ваши данные для входа в TransCon
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Логин
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Введите ваш логин"
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Пароль
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="Введите ваш пароль"
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти в систему
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Забыли пароль?{' '}
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">
                    Обратитесь в поддержку
                  </span>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

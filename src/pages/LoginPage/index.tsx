import LoginFormContainer from '@/components/forms/LoginForm';
import { Truck, Shield, Clock } from 'lucide-react';

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <Truck className="w-16 h-16 text-white" />
                <span className="ml-3 text-4xl font-bold">TransCon</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Добро пожаловать в TransCon
              </h1>
              <p className="text-xl text-purple-100 max-w-md">
                Управляйте вашими фрахтами, водителями и финансами в одном месте
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Управление фрахтами</h3>
                  <p className="text-purple-100 text-sm">
                    Отслеживайте все ваши грузоперевозки
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Безопасность</h3>
                  <p className="text-purple-100 text-sm">
                    Защищенные данные и надежная система
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Доступ</h3>
                  <p className="text-purple-100 text-sm">
                    Работайте в любое время, из любого места
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Truck className="w-12 h-12 text-purple-600" />
                <span className="ml-2 text-2xl font-bold text-gray-800">
                  TransCon
                </span>
              </div>
              <h1 className="text-xl font-semibold text-gray-600">
                Вход в систему
              </h1>
            </div>

            <LoginFormContainer />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

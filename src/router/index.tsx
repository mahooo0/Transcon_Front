import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import RootLayout from '@/layout/RootLayout';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import EmployeesPage from '@/pages/EmployeesPage';
import EmployeeForm from '@/components/forms/EmployeeForm';
import DriversPage from '@/pages/Drivers';
import AdditionalTransport from '@/pages/AdditionalTransport';
import Trucks from '@/pages/Trucks';
import Trailers from '@/pages/trailers';
import TrailersForm from '@/components/forms/TrailersForm';
import CreateDriver from '@/pages/CreateDriver';
import EditDriver from '@/pages/EditDriver';
import TrucksForm from '@/components/forms/TrucksForm';
import ExtraTransportForm from '@/components/forms/ExtraTransportForm';
import Freights from '@/pages/Freights';
import CreateFreight from '@/pages/CreateFreight';
import EditFreight from '@/pages/EditFreight';
import ViewFreight from '@/pages/ViewFreight';
import Journal from '@/pages/Journal';
import CreateJournal from '@/pages/CreateJournal';
import EditJournal from '@/pages/EditJournal';
import ViewJournal from '@/pages/ViewJournal';
import Payments from '@/pages/Payments';
import CreatePayment from '@/pages/CreatePayment';
import MonthlyReport from '@/pages/Finance/MonthlyReport';
import CarReport from '@/pages/CarReport';
import EmployeeReport from '@/pages/EmployeeReport';

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'transport/trailers',
        element: (
          <ProtectedRoute>
            <Trailers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/trailers/new',
        element: (
          <ProtectedRoute>
            <TrailersForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/trailers/edit/:id',
        element: (
          <ProtectedRoute>
            <TrailersForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/extra',
        element: (
          <ProtectedRoute>
            <AdditionalTransport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/extra/new',
        element: (
          <ProtectedRoute>
            <ExtraTransportForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/extra/edit/:id',
        element: (
          <ProtectedRoute>
            <ExtraTransportForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'drivers',
        element: (
          <ProtectedRoute>
            <DriversPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'drivers/new',
        element: (
          <ProtectedRoute>
            <CreateDriver />
          </ProtectedRoute>
        ),
      },
      {
        path: 'drivers/edit/:id',
        element: (
          <ProtectedRoute>
            <EditDriver />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employees',
        element: (
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            ),
          },

          {
            path: 'update/:id',
            element: (
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'access-config',
        element: (
          <ProtectedRoute>
            <div>Access Config Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/trucks',
        element: (
          <ProtectedRoute>
            <Trucks />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/trucks/new',
        element: (
          <ProtectedRoute>
            <TrucksForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport/trucks/edit/:id',
        element: (
          <ProtectedRoute>
            <TrucksForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'freights',
        element: (
          <ProtectedRoute>
            <Freights />
          </ProtectedRoute>
        ),
      },
      {
        path: 'freights/new',
        element: (
          <ProtectedRoute>
            <CreateFreight />
          </ProtectedRoute>
        ),
      },
      {
        path: 'freights/edit/:id',
        element: (
          <ProtectedRoute>
            <EditFreight />
          </ProtectedRoute>
        ),
      },
      {
        path: 'freights/view/:id',
        element: (
          <ProtectedRoute>
            <ViewFreight />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal',
        element: (
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal/new',
        element: (
          <ProtectedRoute>
            <CreateJournal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal/edit/:id',
        element: (
          <ProtectedRoute>
            <EditJournal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'journal/view/:id',
        element: (
          <ProtectedRoute>
            <ViewJournal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payments',
        element: (
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payments/create/:freightId',
        element: (
          <ProtectedRoute>
            <CreatePayment />
          </ProtectedRoute>
        ),
      },
      {
        path: 'finance/monthly-report',
        element: (
          <ProtectedRoute>
            <MonthlyReport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'car-report',
        element: (
          <ProtectedRoute>
            <CarReport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employee-report',
        element: (
          <ProtectedRoute>
            <EmployeeReport />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);

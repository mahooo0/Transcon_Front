import { useState } from 'react';
import { columns, exportColumns } from '@/data/employees';
import PageHeader from '@/components/common/PageHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable } from '@/components/tables/DataTable';
import { useMatch, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { Employee, EmployeeFilterParams } from '@/services/employees/types';
import { useGetEmployees } from '@/hooks/employees/useGetEmployees';
import { useTableExport } from '@/hooks/useTableExport';
import { ModuleNames } from '@/types/enum';
import toast from 'react-hot-toast';
import { useEmployeeFilterFields } from '@/hooks/employees/useEmployeeFilterFields';
import ChangeStatusModal from './ChangeStatusModal';
import { useToggleStatusEmployees } from '@/hooks/employees/useToggleStatusEmployees';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const filterFields = useEmployeeFilterFields();
  const isNew = useMatch('/employees/new');
  const isUpdate = useMatch('/employees/update/:id');

  const [filters, setFilters] = useState<EmployeeFilterParams>({
    page: 1,
    limit: 20,
  });

  const [deactivateDialog, setDeactivateDialog] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({
    isOpen: false,
    employee: null,
  });

  const { data: employees } = useGetEmployees(filters);
  const { mutateAsync } = useToggleStatusEmployees();

  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: employees?.data || [],
    columns: exportColumns,
    filename: 'employees',
    title: 'Список сотрудников',
    totalRecords: employees?.data.length,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenActivateModal = (employee: Employee) => {
    setDeactivateDialog({
      isOpen: true,
      employee,
    });
  };

  const handleDeactivateConfirm = async () => {
    const employee = deactivateDialog.employee;
    if (!employee) return;

    try {
      await mutateAsync(employee.id);
      toast.success('Сотрудник деактивирован');
    } catch {
      toast.error('Ошибка при деактивации сотрудника');
    } finally {
      setDeactivateDialog({ isOpen: false, employee: null });
    }
  };

  const handleDeactivateCancel = () => {
    setDeactivateDialog({ isOpen: false, employee: null });
  };

  const getTableActions = () => {
    const actions = [];
    const userActiveStatus = deactivateDialog.employee?.isActive;

    if (canUpdate(ModuleNames.USERS)) {
      actions.push({
        key: 'edit',
        label: 'Редактировать',
        onClick: (employee: Employee) =>
          navigate(`/employees/update/${employee.id}`),
      });
    }

    if (canDelete(ModuleNames.USERS)) {
      actions.push({
        key: userActiveStatus ? 'deactivate' : 'activate',
        label: userActiveStatus ? 'Деактивировать' : 'Активировать',
        onClick: handleOpenActivateModal,
        variant: userActiveStatus ? ('danger' as const) : ('success' as const),
      });
    }

    return actions;
  };

  const handleAddEmployee = () => {
    navigate('/employees/new');
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleRowClick = (employee: Employee) => {
    setDeactivateDialog({
      isOpen: false,
      employee,
    });
  };

  if (isNew || isUpdate) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ">
      <PageHeader
        title="Сотрудники"
        onAdd={canCreate(ModuleNames.USERS) ? handleAddEmployee : undefined}
      />

      <FilterBar
        filters={filterFields}
        values={filters}
        onChange={handleFilterChange}
      />

      <DataTable
        columns={columns}
        data={employees?.data || []}
        actions={getTableActions()}
        onRowClick={handleRowClick}
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
        pagination={{
          current: filters.page || 1,
          total: employees?.meta?.totalPages || 0,
          pageSize: filters.limit || 20,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      <ChangeStatusModal
        deactivateDialog={deactivateDialog}
        handleDeactivateCancel={handleDeactivateCancel}
        handleDeactivateConfirm={handleDeactivateConfirm}
      />
    </div>
  );
};

export default EmployeesPage;

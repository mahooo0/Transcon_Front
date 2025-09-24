import { ExportColumn, ExportOptions, ExportService } from '@/helpers/exports';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/typeHooks';
import { useMemo } from 'react';

interface UseTableExportProps {
  //todo: fix this
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  columns: ExportColumn[];
  filename: string;
  title?: string;
  totalRecords?: number;
}

export const useTableExport = ({
  data,
  columns,
  filename,
  title,
  totalRecords,
}: UseTableExportProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const exportOptions = useMemo(
    (): Omit<ExportOptions, 'filename'> => ({
      title,
      columns,
      data,
      metadata: {
        exportedBy: user?.fullName,
        exportedAt: new Date(),
        totalRecords: totalRecords || data.length,
      },
    }),
    [data, columns, title, user, totalRecords]
  );

  const handleExportXLSX = () => {
    ExportService.exportToXLSX({
      ...exportOptions,
      filename: `${filename}_${new Date().toISOString().split('T')[0]}`,
    });
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF({
      ...exportOptions,
      filename: `${filename}_${new Date().toISOString().split('T')[0]}`,
    });
  };

  return {
    handleExportXLSX,
    handleExportPDF,
  };
};

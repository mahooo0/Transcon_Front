import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

interface ITablePaginationProps {
    pagination: {
        current: number;
        total: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
}

const TablePagination = ({ pagination }: ITablePaginationProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              pagination.onPageSizeChange(Number(e.target.value))
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span className="text-sm text-gray-700">
          {pagination.current}/{pagination.total}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => pagination.onPageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon size={16} />
          </button>
          <button
            onClick={() => pagination.onPageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default TablePagination;

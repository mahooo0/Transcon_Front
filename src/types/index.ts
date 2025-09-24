/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export interface StatusConfig {
  [key: string]: {
    label: string;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface DateStatusConfig {
  [key: string]: {
    label: string;
    color: 'yellow' | 'red' | 'white';
  };
}

import React from 'react';
import { FilterField } from '@/types';
import { ChevronDown, Calendar, Filter } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IFilterBarProps {
  filters: FilterField[];
  //todo: fix this
  values: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange: (key: string, value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const FilterBar: React.FC<IFilterBarProps> = ({
  filters,
  values,
  onChange,
}) => {
  const renderFilter = (filter: FilterField) => {
    const stringValue = values[filter.key]?.toString() || '';

    switch (filter.type) {
      case 'text':
        return (
          <input
            key={filter.key}
            type="text"
            placeholder={filter.placeholder || filter.label}
            value={stringValue}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        );

      case 'select':
        return (
          <div key={filter.key} className="relative">
            <select
              value={stringValue}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-slate-200 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/80 backdrop-blur-sm min-w-[120px] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="">{filter.placeholder || filter.label}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        );

      case 'date':
        return (
          <div key={filter.key} className="relative">
            <input
              type="date"
              value={stringValue}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="px-4 py-3 pr-10 border border-slate-200 w-full bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <Calendar className="absolute right-3 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm mb-6 overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-800">
                Фильтры
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="gap-4 grid grid-cols-5">
              {filters.map((filter) => (
                <div key={filter.key} className="flex flex-col col-span-1">
                  <label className="text-sm font-semibold text-slate-700 mb-2">
                    {filter.label}
                  </label>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

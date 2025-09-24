import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  key: string;
  label: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  columns: ExportColumn[];
  //todo: fix this
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  metadata?: {
    exportedBy?: string;
    exportedAt?: Date;
    totalRecords?: number;
  };
}

export class ExportService {
  static exportToXLSX(options: ExportOptions): void {
    const { filename, title, columns, data, metadata } = options;

    const wb = XLSX.utils.book_new();

    // Создаем данные для экспорта с заголовками
    const exportData = [
      // Заголовки колонок
      columns.map((col) => col.label),
      // Данные
      ...data.map((row) => {
        return columns.map((col) => this.getNestedValue(row, col.key) || '');
      }),
    ];

    // Создаем лист из массива данных
    let ws = XLSX.utils.aoa_to_sheet(exportData);

    // Устанавливаем ширину колонок
    const colWidths = columns.map((col) => ({ wch: col.width || 15 }));
    ws['!cols'] = colWidths;

    // Добавляем заголовок, если есть
    if (title) {
      // Создаем новый лист с заголовком
      const newWs = XLSX.utils.aoa_to_sheet([
        [title],
        [], // Пустая строка после заголовка
        ...exportData,
      ]);

      // Копируем стили и настройки
      newWs['!cols'] = colWidths;
      ws = newWs;
    }

    // Добавляем метаданные в конец
    if (metadata) {
      const metaRows = [];
      if (metadata.exportedBy)
        metaRows.push([`Экспортировал: ${metadata.exportedBy}`]);
      if (metadata.exportedAt)
        metaRows.push([
          `Дата экспорта: ${metadata.exportedAt.toLocaleString('ru-RU')}`,
        ]);
      if (metadata.totalRecords)
        metaRows.push([`Всего записей: ${metadata.totalRecords}`]);

      if (metaRows.length > 0) {
        const lastRow = XLSX.utils.decode_range(ws['!ref'] || 'A1').e.r;
        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: `A${lastRow + 2}` });
        XLSX.utils.sheet_add_aoa(ws, metaRows, { origin: `A${lastRow + 3}` });
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  static exportToPDF(options: ExportOptions): void {
    const { filename, title, columns, data, metadata } = options;

    const doc = new jsPDF();

    let startY = 20;

    if (title) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, startY);
      startY += 15;
    }

    if (metadata) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (metadata.exportedAt) {
        doc.text(
          `Дата экспорта: ${metadata.exportedAt.toLocaleString('ru-RU')}`,
          14,
          startY
        );
        startY += 7;
      }

      if (metadata.exportedBy) {
        doc.text(`Экспортировал: ${metadata.exportedBy}`, 14, startY);
        startY += 7;
      }

      if (metadata.totalRecords) {
        doc.text(`Всего записей: ${metadata.totalRecords}`, 14, startY);
        startY += 7;
      }

      startY += 5;
    }

    const tableColumns = columns.map((col) => col.label);
    const tableRows = data.map((row) =>
      columns.map((col) => this.getNestedValue(row, col.key) || '')
    );

    // Use autoTable correctly
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: startY,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10, right: 14, bottom: 10, left: 14 },
    });

    doc.save(`${filename}.pdf`);
  }

  //todo: fix this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  }

  //todo: fix this
  static formatForExport(
    //todo: fix this
    value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    type?: 'date' | 'number' | 'currency'
  ): string {
    if (value === null || value === undefined) return '';

    switch (type) {
      case 'date':
        return value instanceof Date
          ? value.toLocaleDateString('ru-RU')
          : value;
      case 'number':
        return typeof value === 'number'
          ? value.toLocaleString('ru-RU')
          : value;
      case 'currency':
        return typeof value === 'number'
          ? new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(value)
          : value;
      default:
        return String(value);
    }
  }
}

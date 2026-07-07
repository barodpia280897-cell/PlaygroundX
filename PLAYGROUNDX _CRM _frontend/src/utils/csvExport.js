// src/utils/csvExport.js

/**
 * Export an array of objects to a CSV download.
 * @param {Array<object>} data  - rows to export
 * @param {string} filename     - e.g. 'invoices_2024.csv'
 * @param {Array<string>} [cols] - optional ordered column keys; defaults to all keys
 */
export function exportCSV(data, filename = 'export.csv', cols) {
  if (!data || data.length === 0) {
    window.dispatchEvent(new CustomEvent('globalToast', { 
      detail: { type: 'error', title: 'Export Failed', message: 'No data available to export.' } 
    }));
    return false;
  }
  const headers = cols || Object.keys(data[0]);
  const escape = (v) => {
    const str = String(v ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const rows = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(row[h])).join(',')),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

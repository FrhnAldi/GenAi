import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { formatIDR } from '../data/products';
import { ORDER_STATUS_META } from '../data/orderStatus';
import type { Transaction } from '../types/pos';

const PAYMENT_LABELS: Record<string, string> = {
  tunai: 'Tunai',
  qris: 'QRIS',
  kartu: 'Kartu',
  ewallet: 'E-Wallet',
};

function orderTypeLabel(t: Transaction): string {
  if (t.orderType === 'takeaway') return 'Bawa Pulang';
  if (t.tableNumber) return `Dine-in · Meja ${t.tableNumber}`;
  return t.orderType === 'dine-in' ? 'Dine-in' : '-';
}

function itemsLabel(t: Transaction): string {
  return t.items
    .map((i) => `${i.name} x${i.quantity}${i.note ? ` (${i.note})` : ''}`)
    .join('; ');
}

function timestampParts(ts: number) {
  const date = new Date(ts);
  return {
    date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

function buildSummary(transactions: Transaction[]) {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalItems = transactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);
  const byStatus: Record<string, number> = {};
  transactions.forEach((t) => (byStatus[t.status] = (byStatus[t.status] ?? 0) + 1));
  return { totalRevenue, totalItems, totalTransactions: transactions.length, byStatus };
}

function reportFilename(ext: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `Laporan-Pesanan-RasaNusa-${stamp}.${ext}`;
}

/**
 * Exports the given transactions to an .xlsx workbook with two sheets:
 * a per-order detail sheet and a summary sheet, then triggers a browser
 * download.
 */
export function exportTransactionsToExcel(transactions: Transaction[]) {
  const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  const detailRows = sorted.map((t, idx) => {
    const { date, time } = timestampParts(t.timestamp);
    return {
      No: idx + 1,
      'ID Pesanan': t.id,
      Tanggal: date,
      Waktu: time,
      'Pelanggan / Kasir': t.customerName ?? t.cashierName,
      'Jenis Pesanan': orderTypeLabel(t),
      Item: itemsLabel(t),
      Subtotal: t.subtotal,
      Diskon: t.discount ?? 0,
      Pajak: Math.round(t.tax),
      Total: Math.round(t.total),
      'Metode Bayar': PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod,
      Status: ORDER_STATUS_META[t.status].label,
    };
  });

  const summary = buildSummary(sorted);
  const summaryRows = [
    { Ringkasan: 'Total Pendapatan', Nilai: summary.totalRevenue },
    { Ringkasan: 'Total Item Terjual', Nilai: summary.totalItems },
    { Ringkasan: 'Jumlah Transaksi', Nilai: summary.totalTransactions },
    { Ringkasan: '', Nilai: '' },
    ...Object.entries(summary.byStatus).map(([status, count]) => ({
      Ringkasan: `Status: ${ORDER_STATUS_META[status as keyof typeof ORDER_STATUS_META]?.label ?? status}`,
      Nilai: count,
    })),
    { Ringkasan: '', Nilai: '' },
    { Ringkasan: 'Dicetak pada', Nilai: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) },
  ];

  const wb = XLSX.utils.book_new();
  const detailSheet = XLSX.utils.json_to_sheet(detailRows);
  detailSheet['!cols'] = [
    { wch: 4 },
    { wch: 16 },
    { wch: 12 },
    { wch: 8 },
    { wch: 20 },
    { wch: 18 },
    { wch: 50 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, detailSheet, 'Riwayat Pesanan');

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 24 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan');

  XLSX.writeFile(wb, reportFilename('xlsx'));
}

/**
 * Exports the given transactions to a paginated PDF report (summary block
 * plus a detail table), then triggers a browser download.
 */
export function exportTransactionsToPDF(transactions: Transaction[]) {
  const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  const summary = buildSummary(sorted);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFontSize(16);
  doc.text('Laporan Pesanan — RasaNusa', 40, 40);
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Dicetak pada ${new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}`, 40, 56);

  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text(
    `Total Pendapatan: ${formatIDR(summary.totalRevenue)}    |    Item Terjual: ${summary.totalItems}    |    Jumlah Transaksi: ${summary.totalTransactions}`,
    40,
    76
  );

  const body = sorted.map((t, idx) => {
    const { date, time } = timestampParts(t.timestamp);
    return [
      String(idx + 1),
      t.id,
      `${date} ${time}`,
      t.customerName ?? t.cashierName,
      orderTypeLabel(t),
      itemsLabel(t),
      formatIDR(t.total),
      PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod,
      ORDER_STATUS_META[t.status].label,
    ];
  });

  autoTable(doc, {
    startY: 92,
    head: [['No', 'ID', 'Tanggal', 'Pelanggan/Kasir', 'Jenis', 'Item', 'Total', 'Bayar', 'Status']],
    body,
    styles: { fontSize: 7.5, cellPadding: 4, overflow: 'linebreak' },
    headStyles: { fillColor: [201, 122, 43], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 62 },
      2: { cellWidth: 60 },
      3: { cellWidth: 70 },
      4: { cellWidth: 60 },
      5: { cellWidth: 220 },
      6: { cellWidth: 55 },
      7: { cellWidth: 42 },
      8: { cellWidth: 55 },
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(reportFilename('pdf'));
}

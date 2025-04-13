import dayjs from 'dayjs';
import type { SummaryData, MonthlySales, TopItem, RecentInvoice } from '@/app/management/dashboard/page';

// Mock data for summary statistics
export const mockSummaryData: SummaryData = {
  userCount: 1250,
  exhibitCount: 85,
  postCount: 320,
  invoiceCount: 1560,
  totalSales: 125000000,
  usedTicketsCount: 980,
  unusedTicketsCount: 580,
};

// Mock data for monthly sales
export const mockMonthlySales: MonthlySales[] = [
  { month: 'Tháng 1', salesAmount: 8500000, salesCount: 120 },
  { month: 'Tháng 2', salesAmount: 9200000, salesCount: 135 },
  { month: 'Tháng 3', salesAmount: 10500000, salesCount: 150 },
  { month: 'Tháng 4', salesAmount: 9800000, salesCount: 140 },
  { month: 'Tháng 5', salesAmount: 11500000, salesCount: 165 },
  { month: 'Tháng 6', salesAmount: 12500000, salesCount: 180 },
  { month: 'Tháng 7', salesAmount: 13500000, salesCount: 195 },
  { month: 'Tháng 8', salesAmount: 12800000, salesCount: 185 },
  { month: 'Tháng 9', salesAmount: 14500000, salesCount: 210 },
  { month: 'Tháng 10', salesAmount: 15500000, salesCount: 225 },
  { month: 'Tháng 11', salesAmount: 16500000, salesCount: 240 },
  { month: 'Tháng 12', salesAmount: 17500000, salesCount: 255 },
];

// Mock data for top selling items
export const mockTopItems: TopItem[] = [
  { name: 'Vé người lớn', quantity: 1200, revenue: 60000000, type: 'ticket' as const },
  { name: 'Vé trẻ em', quantity: 850, revenue: 25500000, type: 'ticket' as const },
  { name: 'Vé đoàn', quantity: 320, revenue: 48000000, type: 'ticket' as const },
];

// Mock data for recent invoices
export const mockRecentInvoices: RecentInvoice[] = [
  {
    id: 1,
    key: '1',
    transId: 'INV-2024-001',
    fullName: 'Nguyễn Văn A',
    totalPrice: 1500000,
    isUsed: true,
    createdAt: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 2,
    key: '2',
    transId: 'INV-2024-002',
    fullName: 'Trần Thị B',
    totalPrice: 2500000,
    isUsed: false,
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: 3,
    key: '3',
    transId: 'INV-2024-003',
    fullName: 'Lê Văn C',
    totalPrice: 3500000,
    isUsed: true,
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
  {
    id: 4,
    key: '4',
    transId: 'INV-2024-004',
    fullName: 'Phạm Thị D',
    totalPrice: 2000000,
    isUsed: false,
    createdAt: dayjs().subtract(4, 'hour').toISOString(),
  },
  {
    id: 5,
    key: '5',
    transId: 'INV-2024-005',
    fullName: 'Hoàng Văn E',
    totalPrice: 3000000,
    isUsed: true,
    createdAt: dayjs().subtract(5, 'hour').toISOString(),
  },
]; 
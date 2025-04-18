'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Spin,
  Divider,
  DatePicker,
  Select,
  message,
  Button,
  Tabs,
  Progress,
  Empty,
} from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import * as api from '@/lib/api';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import {
  mockSummaryData,
  mockMonthlySales,
  mockTopItems,
  mockRecentInvoices,
} from '@/lib/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as reportApi from '@/request/report';
import { get } from 'lodash';

export interface SummaryData {
  userCount: number;
  exhibitCount: number;
  postCount: number;
  invoiceCount: number;
  totalSales: number;
  usedTicketsCount: number;
  unusedTicketsCount: number;
}

export interface MonthlySales {
  month: string;
  salesAmount: number;
  salesCount: number;
}

export interface TopItem {
  ticket?: {
    id?: number;
    name?: string;
    type?: string;
    price?: string;
    description?: string;
  };
  count?: number;
  revenue?: number;
}

export interface RecentInvoice {
  id: number;
  key: string;
  transId: string;
  fullName: string;
  totalPrice: number;
  isUsed: boolean;
  createdAt: string;
}

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData>(mockSummaryData);
  const [monthlySales, setMonthlySales] =
    useState<MonthlySales[]>(mockMonthlySales);
  const [invoiceChart, setInvoiceChart] = useState<any[]>([]);

  const [topItems, setTopItems] = useState<TopItem[]>(mockTopItems);
  const [recentInvoices, setRecentInvoices] =
    useState<RecentInvoice[]>(mockRecentInvoices);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTab, setSelectedTab] = useState('1');

  const { TabPane } = Tabs;

  // Safe initialization after component is mounted
  useEffect(() => {
    setMounted(true);
    fetchAllStats();
  }, [selectedYear]);

  // Fetch all statistics data
  const fetchAllStats = async () => {
    try {
      setLoading(true);

      // Fetch overview data
      const overviewData = await reportApi.getOverview(selectedYear);
      if (overviewData) {
        setSummary(overviewData);
      }

      // Fetch revenue chart data
      const revenueChartData = await reportApi.getRevenueChart(selectedYear);

      console.log('revenueChartData', revenueChartData);
      if (revenueChartData && revenueChartData.data) {
        setMonthlySales(revenueChartData.data || []);
      }

      // Fetch invoice chart data (used directly for the invoice count chart)
      const invoiceChartData = await reportApi.getInvoiceChart(selectedYear);
      if (invoiceChartData && invoiceChartData.data) {
        setInvoiceChart(invoiceChartData.data || []);
      }

      // Fetch recent invoices
      const recentInvoicesData = await reportApi.getRecentInvoice();
      if (recentInvoicesData) {
        const invoices = recentInvoicesData.data.map((invoice: any) => ({
          ...invoice,
          key: String(invoice.id || invoice._id),
        }));
        setRecentInvoices(invoices);
      }

      // Fetch top tickets
      const topTicketsData = await reportApi.getTopTicket();
      if (topTicketsData && topTicketsData.data) {
        // Add some logging to debug the response
        console.log('Top tickets data:', topTicketsData.data);

        // Make sure we only use valid items
        const validTopItems = Array.isArray(topTicketsData.data)
          ? topTicketsData.data.filter(
              (item: any) => item && typeof item === 'object'
            )
          : [];

        setTopItems(validTopItems);
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Table columns for recent invoices
  const invoiceColumns: ColumnsType<RecentInvoice> = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transId',
      key: 'transId',
      ellipsis: true,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isUsed',
      key: 'isUsed',
      render: (isUsed) => (
        <span className={isUsed ? 'text-green-600' : 'text-blue-600'}>
          {isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
        </span>
      ),
    },
  ];

  // Table columns for top items
  const topItemsColumns: ColumnsType<TopItem> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: ['ticket', 'name'],
      key: 'ticket.name',
      render: (_, record) => record.ticket?.name || 'Unknown',
    },
    {
      title: 'Loại',
      dataIndex: ['ticket', 'type'],
      key: 'ticket.type',
      render: (_, record) => record.ticket?.type || 'Unknown',
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      render: (count) => count || 0,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => formatCurrency(revenue || 0),
    },
  ];

  // Generate years for selection
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear; i++) {
    yearOptions.push({ value: i, label: `Năm ${i}` });
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Check before rendering
  if (!mounted) return null;

  return (
    <div className="mx-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Thống kê và báo cáo
        </h1>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            options={yearOptions}
            style={{ width: 120 }}
          />
          <Button type="primary" onClick={fetchAllStats} loading={loading}>
            Làm mới
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={get(summary, 'totalUsers', 0)}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số hiện vật"
                value={get(summary, 'totalExhibits', 0)}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số bài viết"
                value={get(summary, 'totalPosts', 0)}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu năm"
                value={formatCurrency(get(summary, 'totalRevenue', 0))}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for different charts */}
        <Tabs defaultActiveKey="1" onChange={setSelectedTab} className="mb-6">
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Doanh thu theo tháng
              </span>
            }
            key="1"
          >
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium">
                Biểu đồ doanh thu theo tháng (năm {selectedYear})
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value: number) =>
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Số lượng hóa đơn
              </span>
            }
            key="2"
          >
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium">
                Biểu đồ số lượng hóa đơn theo tháng (năm {selectedYear})
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={invoiceChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Số lượng hóa đơn"
                      stroke="#ff7a45"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPane>
        </Tabs>

        <Row gutter={[16, 16]}>
          {/* Recent Invoices */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <span>
                  <UnorderedListOutlined className="mr-2" />
                  Hóa đơn gần đây
                </span>
              }
              className="mb-6"
            >
              {recentInvoices.length > 0 ? (
                <Table
                  dataSource={recentInvoices}
                  columns={invoiceColumns}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </Card>
          </Col>

          {/* Top Items */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <span>
                  <BarChartOutlined className="mr-2" />
                  Sản phẩm bán chạy
                </span>
              }
              className="mb-6"
            >
              {topItems.length > 0 ? (
                <Table
                  dataSource={topItems}
                  columns={topItemsColumns}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </Card>
          </Col>
        </Row>

        {/* Top items visualization */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium">Sản phẩm bán chạy</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topItems
                  .filter((item) => item && item.ticket) // Filter out items without ticket property
                  .map((item) => ({
                    ...item,
                    name: item.ticket?.name || 'Unknown', // Safe access with fallback
                  }))}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Doanh thu"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default DashboardPage;

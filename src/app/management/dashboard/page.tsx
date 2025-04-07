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

interface SummaryData {
  userCount: number;
  exhibitCount: number;
  postCount: number;
  invoiceCount: number;
  totalSales: number;
  usedTicketsCount: number;
  unusedTicketsCount: number;
}

interface MonthlySales {
  month: string;
  salesAmount: number;
  salesCount: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
  type: 'ticket' | 'service';
}

interface RecentInvoice {
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
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData>({
    userCount: 0,
    exhibitCount: 0,
    postCount: 0,
    invoiceCount: 0,
    totalSales: 0,
    usedTicketsCount: 0,
    unusedTicketsCount: 0,
  });
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTab, setSelectedTab] = useState('1');

  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;

  // Safe initialization after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all statistics data
  const fetchAllStats = async () => {
    try {
      setLoading(true);

      // Fetch counts in parallel
      const [
        usersCountRes,
        exhibitsCountRes,
        postsCountRes,
        salesStatsRes,
        salesByMonthRes,
        recentInvoicesRes,
        topSellingRes,
      ] = await Promise.all([
        api.fetchUsersCount(),
        api.fetchExhibitsCount(),
        api.fetchPostsCount(),
        api.fetchSalesStats(),
        api.fetchSalesByMonth(selectedYear),
        api.fetchRecentInvoices(5),
        api.fetchTopSelling(),
      ]);

      // Process summary data
      const invoices = salesStatsRes.data.data || [];
      const totalSales = invoices.reduce((sum: number, invoice: any) => {
        return sum + (parseInt(invoice.attributes.totalPrice) || 0);
      }, 0);

      const usedTickets = invoices.filter(
        (invoice: any) => invoice.attributes.isUsed
      ).length;
      const unusedTickets = invoices.length - usedTickets;

      setSummary({
        userCount: usersCountRes.data || 0,
        exhibitCount: exhibitsCountRes.data || 0,
        postCount: postsCountRes.data || 0,
        invoiceCount: invoices.length,
        totalSales: totalSales,
        usedTicketsCount: usedTickets,
        unusedTicketsCount: unusedTickets,
      });

      // Process monthly sales data
      processMonthlyData(salesByMonthRes.data.data || []);

      // Process recent invoices
      processRecentInvoices(recentInvoicesRes.data.data || []);

      // Process top selling items
      processTopSellingItems(topSellingRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Process monthly sales data
  const processMonthlyData = (invoices: any[]) => {
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    // Initialize monthly data
    const monthlyData: MonthlySales[] = monthNames.map((month, index) => ({
      month,
      salesAmount: 0,
      salesCount: 0,
    }));

    // Aggregate sales by month
    invoices.forEach((invoice: any) => {
      const createdAt = new Date(invoice.attributes.createdAt);
      const monthIndex = createdAt.getMonth();
      const amount = parseInt(invoice.attributes.totalPrice) || 0;

      monthlyData[monthIndex].salesAmount += amount;
      monthlyData[monthIndex].salesCount += 1;
    });

    setMonthlySales(monthlyData);
  };

  // Process recent invoices
  const processRecentInvoices = (invoices: any[]) => {
    const formattedInvoices: RecentInvoice[] = invoices.map((invoice: any) => ({
      id: invoice.id,
      key: invoice.id.toString(),
      transId: invoice.attributes.transId || '',
      fullName: invoice.attributes.fullName || '',
      totalPrice: invoice.attributes.totalPrice || 0,
      isUsed: invoice.attributes.isUsed || false,
      createdAt: invoice.attributes.createdAt || '',
    }));

    setRecentInvoices(formattedInvoices);
  };

  // Process top selling items
  const processTopSellingItems = (invoices: any[]) => {
    const itemMap = new Map<
      string,
      {
        name: string;
        quantity: number;
        revenue: number;
        type: 'ticket' | 'service';
      }
    >();

    // Extract all invoice details and group by item
    invoices.forEach((invoice: any) => {
      const details = invoice.attributes.invoice_details?.data || [];

      details.forEach((detail: any) => {
        const ticket = detail.attributes.ticket?.data;
        const service = detail.attributes.service?.data;

        if (ticket) {
          const name = ticket.attributes.name;
          const key = `ticket-${ticket.id}`;
          const quantity = detail.attributes.quantity || 0;
          const price = detail.attributes.price || 0;

          if (itemMap.has(key)) {
            const item = itemMap.get(key)!;
            item.quantity += quantity;
            item.revenue += price;
          } else {
            itemMap.set(key, {
              name,
              quantity,
              revenue: price,
              type: 'ticket',
            });
          }
        }

        if (service) {
          const name = service.attributes.name;
          const key = `service-${service.id}`;
          const quantity = detail.attributes.quantity || 0;
          const price = detail.attributes.price || 0;

          if (itemMap.has(key)) {
            const item = itemMap.get(key)!;
            item.quantity += quantity;
            item.revenue += price;
          } else {
            itemMap.set(key, {
              name,
              quantity,
              revenue: price,
              type: 'service',
            });
          }
        }
      });
    });

    // Convert map to array and sort by quantity
    const sortedItems = Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setTopItems(sortedItems);
  };

  useEffect(() => {
    if (mounted) {
      fetchAllStats();
    }
  }, [mounted, selectedYear]);

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

  // Calculate max value for sales graph
  const maxSalesAmount = useMemo(() => {
    if (monthlySales.length === 0) return 100000;
    return Math.max(...monthlySales.map((item) => item.salesAmount)) * 1.1;
  }, [monthlySales]);

  // Calculate max value for invoice count graph
  const maxSalesCount = useMemo(() => {
    if (monthlySales.length === 0) return 10;
    return Math.max(...monthlySales.map((item) => item.salesCount)) * 1.1;
  }, [monthlySales]);

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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (type === 'ticket' ? 'Vé' : 'Dịch vụ'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => formatCurrency(revenue),
    },
  ];

  // Generate years for selection
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear; i++) {
    yearOptions.push({ value: i, label: `Năm ${i}` });
  }

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
          <Button type="primary" onClick={fetchAllStats}>
            Làm mới dữ liệu
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
                value={summary.userCount}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số hiện vật"
                value={summary.exhibitCount}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số bài viết"
                value={summary.postCount}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu năm"
                value={formatCurrency(summary.totalSales)}
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
              <div className="mt-8">
                {monthlySales.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span>{item.month}</span>
                      <span>{formatCurrency(item.salesAmount)}</span>
                    </div>
                    <Progress
                      percent={Math.round(
                        (item.salesAmount / maxSalesAmount) * 100
                      )}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                ))}
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
              <div className="mt-8">
                {monthlySales.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span>{item.month}</span>
                      <span>{item.salesCount} hóa đơn</span>
                    </div>
                    <Progress
                      percent={Math.round(
                        (item.salesCount / maxSalesCount) * 100
                      )}
                      showInfo={false}
                      strokeColor="#ff7a45"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <PieChartOutlined />
                Trạng thái vé
              </span>
            }
            key="3"
          >
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium">
                Thống kê trạng thái vé
              </h3>
              <div className="flex items-center justify-around p-10">
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={Math.round(
                      (summary.usedTicketsCount /
                        (summary.usedTicketsCount +
                          summary.unusedTicketsCount || 1)) *
                        100
                    )}
                    format={() => `${summary.usedTicketsCount}`}
                    strokeColor="#52c41a"
                  />
                  <p className="mt-4 font-medium">Đã sử dụng</p>
                </div>
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={Math.round(
                      (summary.unusedTicketsCount /
                        (summary.usedTicketsCount +
                          summary.unusedTicketsCount || 1)) *
                        100
                    )}
                    format={() => `${summary.unusedTicketsCount}`}
                    strokeColor="#1890ff"
                  />
                  <p className="mt-4 font-medium">Chưa sử dụng</p>
                </div>
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
          <div className="mt-8">
            {topItems.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span>
                    {item.name} ({item.type === 'ticket' ? 'Vé' : 'Dịch vụ'})
                  </span>
                  <span>{item.quantity} sản phẩm</span>
                </div>
                <Progress
                  percent={Math.round(
                    (item.quantity / (topItems[0]?.quantity || 1)) * 100
                  )}
                  showInfo={false}
                  strokeColor={item.type === 'ticket' ? '#722ed1' : '#eb2f96'}
                />
              </div>
            ))}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default DashboardPage;

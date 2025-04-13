'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Input,
  Modal,
  Tag,
  message,
  Spin,
  Drawer,
  Descriptions,
  Badge,
  Space,
  Tooltip,
  DatePicker,
  Select,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import * as api from '@/lib/api';

// Interface for invoice data based on Strapi schema
interface Invoice {
  documentId: string;
  id: number;
  totalPrice: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  transId: string;
  ticketUrl: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
  users_permissions_user?: { id: number; username: string; email: string };
  invoice_details?: InvoiceDetail[];
}

// Interface for invoice detail data based on Strapi schema
interface InvoiceDetail {
  id: number;
  quantity: number;
  price: number;
  validDate: string;
  ticket?: { id: number; name: string; price: number | string };
  service?: { id: number; name: string; price: number | string };
}

// Processed invoice for display
interface InvoiceRecord extends Invoice {
  key: string;
  details_count: number;
}

const InvoiceManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<InvoiceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);

  // Drawer state for viewing invoice details
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null
  );

  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // Handle page size change
  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  // Fetch invoices when pageSize changes
  useEffect(() => {
    fetchInvoices();
  }, [pageSize]);

  // Safe initialization after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await api.fetchInvoices(pageSize);
      const invoiceData = response.data.data || [];

      // Transform the data to match our component's structure
      const formattedData: InvoiceRecord[] = invoiceData.map(
        (invoice: any) => ({
          id: invoice.id,
          documentId: invoice.documentId,
          key: invoice.id.toString(),
          totalPrice: invoice.totalPrice || 0,
          phoneNumber: invoice.phoneNumber || '',
          email: invoice.email || '',
          fullName: invoice.fullName || '',
          transId: invoice.transId || '',
          ticketUrl: invoice.ticketUrl || '',
          isUsed: invoice.isUsed || false,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
          users_permissions_user: invoice.users_permissions_user?.data
            ? {
                id: invoice.users_permissions_user.data.id,
                ...invoice.users_permissions_user.data,
              }
            : null,
          invoice_details:
            invoice.invoice_details?.map((detail: any) => ({
              id: detail.id,
              quantity: detail.quantity,
              price: detail.price,
              validDate: detail.validDate,
              ticket: detail.ticket?.data
                ? {
                    id: detail.ticket.data.id,
                    ...detail.ticket.data,
                  }
                : null,
              service: detail.service?.data
                ? {
                    id: detail.service.data.id,
                    ...detail.service.data,
                  }
                : null,
            })) || [],
          details_count: invoice.invoice_details?.length || 0,
        })
      );

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      message.error('Không thể tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchInvoices();
    }
  }, [mounted]);

  // Apply filters when search text or filters change
  useEffect(() => {
    let filtered = [...data];

    // Text search filter
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fullName?.toLowerCase().includes(lowerCaseSearch) ||
          item.email?.toLowerCase().includes(lowerCaseSearch) ||
          item.phoneNumber?.toLowerCase().includes(lowerCaseSearch) ||
          item.transId?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');

      filtered = filtered.filter((item) => {
        const createdAt = dayjs(item.createdAt);
        return createdAt.isAfter(startDate) && createdAt.isBefore(endDate);
      });
    }

    // Status filter
    if (statusFilter !== null) {
      const isUsed = statusFilter === 'used';
      filtered = filtered.filter((item) => item.isUsed === isUsed);
    }

    setFilteredData(filtered);
  }, [searchText, data, dateRange, statusFilter]);

  // View invoice details
  const handleViewDetails = (record: InvoiceRecord) => {
    setSelectedInvoice(record);
    setDetailsVisible(true);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  // Toggle invoice usage status
  const toggleInvoiceStatus = async (invoice: InvoiceRecord) => {
    try {
      setLoading(true);
      const newStatus = !invoice.isUsed;

      await api.updateInvoiceStatus(invoice.documentId, newStatus);

      message.success(
        `Hóa đơn đã được đánh dấu là ${newStatus ? 'đã sử dụng' : 'chưa sử dụng'}`
      );
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      message.error('Không thể cập nhật trạng thái hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  // Download ticket as blob
  const downloadTicket = async (ticketUrl: string, fileName: string) => {
    try {
      setLoading(true);
      const response = await fetch(ticketUrl);
      const blob = await response.blob();
      const contentType = response.headers.get('content-type');
      const extension = contentType?.includes('image/')
        ? contentType.split('/')[1] || 'jpg'
        : 'pdf';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.split('.')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      message.error('Không thể tải vé');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns: ColumnsType<InvoiceRecord> = [
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
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
          <div className="text-xs text-gray-500">{record.phoneNumber}</div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isUsed',
      key: 'isUsed',
      filters: [
        { text: 'Đã sử dụng', value: true },
        { text: 'Chưa sử dụng', value: false },
      ],
      onFilter: (value, record) => record.isUsed === value,
      render: (isUsed) =>
        isUsed ? (
          <Tag color="green">Đã sử dụng</Tag>
        ) : (
          <Tag color="blue">Chưa sử dụng</Tag>
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip
            title={
              record.isUsed ? 'Đánh dấu chưa sử dụng' : 'Đánh dấu đã sử dụng'
            }
          >
            <Button
              type={record.isUsed ? 'default' : 'primary'}
              icon={
                record.isUsed ? (
                  <CloseCircleOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={() => toggleInvoiceStatus(record)}
            />
          </Tooltip>
          {record.ticketUrl && (
            <Tooltip title="Tải vé">
              <Button
                type="default"
                icon={<FilePdfOutlined />}
                onClick={() =>
                  downloadTicket(
                    record.ticketUrl,
                    `ticket-${record.transId}.pdf`
                  )
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    console.log('selectedInvoice', selectedInvoice);
  }, [selectedInvoice]);

  // Check before rendering
  if (!mounted) return null;

  return (
    <div className="mx-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hóa đơn</h1>
      </div>

      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email, SĐT, mã giao dịch"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className="max-w-xs"
        />

        <RangePicker
          placeholder={['Từ ngày', 'Đến ngày']}
          onChange={(dates) =>
            setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
          }
        />

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="used">Đã sử dụng</Option>
          <Option value="unused">Chưa sử dụng</Option>
        </Select>
      </div>

      {/* Invoice table */}
      <Spin spinning={loading}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Tổng cộng ${total} hóa đơn`,
            onShowSizeChange: handlePageSizeChange,
          }}
        />
      </Spin>

      {/* Invoice details drawer */}
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setDetailsVisible(false)}
        open={detailsVisible}
        width={700}
        extra={
          selectedInvoice && (
            <Space>
              <Button
                type={selectedInvoice.isUsed ? 'default' : 'primary'}
                onClick={() => {
                  toggleInvoiceStatus(selectedInvoice);
                  setDetailsVisible(false);
                }}
              >
                {selectedInvoice.isUsed
                  ? 'Đánh dấu chưa sử dụng'
                  : 'Đánh dấu đã sử dụng'}
              </Button>
            </Space>
          )
        }
      >
        {selectedInvoice && (
          <>
            <Descriptions title="Thông tin hóa đơn" bordered column={2}>
              <Descriptions.Item label="Mã giao dịch" span={2}>
                {selectedInvoice.transId}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedInvoice.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={selectedInvoice.isUsed ? 'success' : 'processing'}
                  text={selectedInvoice.isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedInvoice.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedInvoice.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Tài khoản liên kết">
                {selectedInvoice.users_permissions_user
                  ? `${selectedInvoice.users_permissions_user.username} (${selectedInvoice.users_permissions_user.email})`
                  : 'Không có'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDate(selectedInvoice.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {formatDate(selectedInvoice.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <span className="text-lg font-semibold text-red-500">
                  {formatCurrency(selectedInvoice.totalPrice)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h3 className="mb-4 text-lg font-medium">Chi tiết đơn hàng</h3>
              <Table
                dataSource={selectedInvoice.invoice_details?.map((detail) => ({
                  ...detail,
                  key: detail.id,
                  name:
                    detail.ticket?.name ||
                    detail.service?.name ||
                    'Không xác định',
                  unitPrice: detail.price / detail.quantity,
                }))}
                pagination={false}
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Loại',
                    key: 'type',
                    render: (_, record) =>
                      record.ticket
                        ? 'Vé'
                        : record.service
                          ? 'Dịch vụ'
                          : 'Không xác định',
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center',
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    render: (price) => formatCurrency(price),
                  },
                  {
                    title: 'Thành tiền',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => formatCurrency(price),
                  },
                  {
                    title: 'Ngày sử dụng',
                    dataIndex: 'validDate',
                    key: 'validDate',
                    render: (date) =>
                      date
                        ? dayjs(date).format('DD/MM/YYYY')
                        : 'Không thời hạn',
                  },
                ]}
                summary={(pageData) => {
                  let totalItems = 0;
                  pageData.forEach(({ quantity }) => {
                    totalItems += quantity;
                  });

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {totalItems}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {formatCurrency(selectedInvoice.totalPrice)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </div>

            <div className="mt-6 flex gap-4">
              {selectedInvoice.ticketUrl && (
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={() =>
                    downloadTicket(
                      selectedInvoice.ticketUrl,
                      `ticket-${selectedInvoice.transId}.pdf`
                    )
                  }
                >
                  Tải vé
                </Button>
              )}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default InvoiceManagement;

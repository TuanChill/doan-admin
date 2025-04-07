'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Spin,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import DynamicReactQuill from '@/components/DynamicReactQuill';
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from '@/request/tickets';

interface StrapiTicket {
  id: number;
  documentId: number;
  name: string;
  price: number;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketRecord {
  key: string;
  id: number;
  documentId: number;
  name: string;
  price: string | number;
  type: string;
  description: string;
  create_at: string;
  update_at: string;
  created_by?: string;
}

const TicketsManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TicketRecord[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<TicketRecord | null>(
    null
  );
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState('admin');
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    type: '',
  });
  const [filteredData, setFilteredData] = useState<TicketRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch tickets from API
  const fetchTickets = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    try {
      setLoading(true);
      const response = await getTickets(
        page,
        pageSize,
        searchFilters.name,
        searchFilters.type
      );

      if (response && response.data) {
        const ticketsData = response.data.map((ticket: StrapiTicket) => ({
          key: ticket.id.toString(),
          id: ticket.id,
          documentId: ticket.documentId,
          name: ticket.name,
          price: formatPrice(ticket.price),
          type: ticket.type,
          description: ticket.description,
          create_at: new Date(ticket.createdAt).toLocaleDateString(),
          update_at: new Date(ticket.updatedAt).toLocaleDateString(),
        }));

        setData(ticketsData);
        setFilteredData(ticketsData);
        setPagination({
          ...pagination,
          current: page,
          total: response.meta.pagination.total,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      message.error('Không thể tải dữ liệu vé');
    } finally {
      setLoading(false);
    }
  };

  // Format price from number to string with VND format
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace('₫', 'đ');
  };

  // Parse price from string back to number
  const parsePrice = (price: string): number => {
    return parseInt(price.replace(/\D/g, ''));
  };

  // Safe access to localStorage after component is mounted
  useEffect(() => {
    setMounted(true);
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUser(username);
    }

    fetchTickets();
  }, []);

  // Hàm hiển thị modal thêm mới
  const showModal = () => {
    setSelectedRecord(null);
    setIsViewMode(false);
    form.setFieldsValue({ created_by: currentUser });
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để sửa!');
      return;
    }

    form.setFieldsValue({
      ...selectedRecord,
      price: selectedRecord.price.toString(),
    });

    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    fetchTickets(1, pagination.pageSize);
  };

  const handleView = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để xem!');
      return;
    }

    form.setFieldsValue({
      ...selectedRecord,
      price: selectedRecord.price.toString(),
    });

    setIsViewMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để xoá!');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá vé: "${selectedRecord.name}"?`,
      okText: 'OK',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteTicket(selectedRecord.documentId);

          // Refresh the list
          fetchTickets();
          setSelectedRecord(null);
          message.success('Đã xoá vé thành công');
        } catch (error) {
          console.error('Error deleting ticket:', error);
          message.error('Không thể xoá vé');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedRecord(null);
    setIsViewMode(false);
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        setLoading(true);

        // Prepare data for API
        const ticketData = {
          name: values.name,
          price: parsePrice(values.price),
          type: values.type,
          description: values.description,
        };

        if (selectedRecord) {
          // Update existing ticket
          await updateTicket(selectedRecord.documentId, ticketData);
          message.success('Cập nhật vé thành công');
        } else {
          // Create new ticket
          await createTicket(ticketData);
          message.success('Thêm mới vé thành công');
        }

        // Refresh the list
        fetchTickets();
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error('Error saving ticket:', error);
        message.error('Không thể lưu thông tin vé');
      } finally {
        setLoading(false);
      }
    });
  };

  // Handle pagination change
  const handleTableChange = (pagination: any) => {
    fetchTickets(pagination.current, pagination.pageSize);
  };

  // Định nghĩa các cột cho Table
  const columns: ColumnsType<TicketRecord> = [
    {
      title: 'Tên vé',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Loại vé',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === 'Vé đoàn' ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      key: 'create_at',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'update_at',
      key: 'update_at',
    },
  ];

  // Add check before rendering
  if (!mounted) return null;

  return (
    <div className="mx-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý vé</h1>
      </div>

      {/* Thanh công cụ filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4 bg-white p-4 shadow-sm">
        <Input
          placeholder="Tìm theo tên vé"
          value={searchFilters.name}
          onChange={(e) =>
            setSearchFilters({ ...searchFilters, name: e.target.value })
          }
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Loại vé"
          allowClear
          style={{ width: 180 }}
          value={searchFilters.type}
          onChange={(value) =>
            setSearchFilters({ ...searchFilters, type: value })
          }
          options={[
            { value: 'Vé lẻ', label: 'Vé lẻ' },
            { value: 'Vé đoàn', label: 'Vé đoàn' },
            { value: 'Vé ưu đãi', label: 'Vé ưu đãi' },
          ]}
        />
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            type="primary"
            onClick={showModal}
            icon={<PlusOutlined />}
            style={{ marginRight: 8 }}
          >
            Thêm mới
          </Button>
          <Button
            onClick={handleView}
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
          >
            Xem
          </Button>
          <Button
            onClick={handleEdit}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Button danger onClick={handleDelete} icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={pagination}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRecord(record);
            },
            style: {
              background:
                selectedRecord?.key === record.key ? '#e6f7ff' : 'inherit',
            },
          })}
        />
      </Spin>

      {/* Modal thêm/sửa */}
      <Modal
        title={
          isViewMode
            ? 'Chi tiết vé'
            : selectedRecord
              ? 'Chỉnh sửa vé'
              : 'Thêm mới vé'
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          isViewMode
            ? [
                <Button key="back" onClick={handleCancel}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="back" onClick={handleCancel}>
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={handleSave}
                  loading={loading}
                >
                  Lưu
                </Button>,
              ]
        }
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode || loading}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên vé"
            rules={[{ required: true, message: 'Vui lòng nhập tên vé!' }]}
          >
            <Input placeholder="Nhập tên vé" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá vé"
            rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
          >
            <Input placeholder="Ví dụ: 50000" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại vé"
            rules={[{ required: true, message: 'Vui lòng chọn loại vé!' }]}
          >
            <Select
              placeholder="Chọn loại vé"
              options={[
                { value: 'Vé lẻ', label: 'Vé lẻ' },
                { value: 'Vé đoàn', label: 'Vé đoàn' },
                { value: 'Vé ưu đãi', label: 'Vé ưu đãi' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả vé" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketsManagement;

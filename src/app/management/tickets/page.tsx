'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Input, Select, Tag, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import DynamicReactQuill from '@/components/DynamicReactQuill';

interface TicketRecord {
  key: string;
  name: string;
  price: string;
  type: string;
  description: string;
  create_at: string;
  update_at: string;
  image?: UploadFile[];
  created_by?: string;
}

const TicketsManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<TicketRecord[]>([
    {
      key: '1',
      name: 'Vé vào cổng người lớn',
      price: '40.000đ',
      type: 'Vé lẻ',
      description:
        'Áp dụng cho khách từ 18 tuổi trở lên. Có hiệu lực trong ngày.',
      create_at: '10/03/2024',
      update_at: '12/03/2024',
    },
    {
      key: '2',
      name: 'Vé vào cổng trẻ em',
      price: '20.000đ',
      type: 'Vé lẻ',
      description:
        'Áp dụng cho trẻ em từ 6 đến 17 tuổi. Miễn phí cho trẻ dưới 6 tuổi.',
      create_at: '10/03/2024',
      update_at: '12/03/2024',
    },
    {
      key: '3',
      name: 'Vé đoàn tham quan',
      price: '150.000đ',
      type: 'Vé đoàn',
      description:
        'Dành cho đoàn từ 10 người trở lên. Hướng dẫn viên miễn phí.',
      create_at: '10/03/2024',
      update_at: '12/03/2024',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false); // State để điều khiển hiển thị modal
  const [form] = Form.useForm(); // Form instance
  const [selectedRecord, setSelectedRecord] = useState<TicketRecord | null>(
    null
  );
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState('admin');
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    type: '',
  });
  const [filteredData, setFilteredData] = useState<TicketRecord[]>(data);

  // Safe access to localStorage after component is mounted
  useEffect(() => {
    setMounted(true);
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUser(username);
    }
  }, []);

  // Hàm hiển thị modal thêm mới
  const showModal = () => {
    setSelectedRecord(null); //  Reset bản ghi đang chọn
    setIsViewMode(false); //  Đảm bảo không đang ở chế độ xem
    form.setFieldsValue({ created_by: currentUser }); // Gán username vào form
    setIsModalVisible(true); //  Mở modal
    form.resetFields(); // Reset form về rỗng
  };

  const handleEdit = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để sửa!');
      return;
    }

    form.setFieldsValue({
      ...selectedRecord,
      image: selectedRecord.image || [], //  Gán fileList vào form
    });

    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = data.filter((item: TicketRecord) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(searchFilters.name.trim().toLowerCase());
      const matchesType = searchFilters.type
        ? item.type === searchFilters.type
        : true;
      return matchesName && matchesType;
    });
    setFilteredData(filtered);
  };

  const handleView = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để xem!');
      return;
    }

    form.setFieldsValue({
      ...selectedRecord,
    });

    setIsViewMode(true); // Bật chế độ xem
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
      onOk: () => {
        const newData = data.filter((item) => item.key !== selectedRecord.key);
        setData(newData);
        setFilteredData(newData); // Thêm dòng này để cập nhật lưới hiển thị
        setSelectedRecord(null);
        message.success('Đã xoá vé');
      },
    });
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form khi đóng modal
    setSelectedRecord(null);
    setIsViewMode(false);
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = () => {
    form.validateFields().then((values) => {
      const imageFile = values.image?.fileList || [];

      if (selectedRecord) {
        //  Nếu đang sửa
        const updatedData = data.map((item) =>
          item.key === selectedRecord.key
            ? {
                ...item,
                ...values,
                image: imageFile,
                update_at: new Date().toLocaleDateString(),
              }
            : item
        );

        //  Sắp xếp theo ngày cập nhật mới nhất
        const sortedData = updatedData.sort(
          (a: TicketRecord, b: TicketRecord) =>
            new Date(b.update_at).getTime() - new Date(a.update_at).getTime()
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Cập nhật vé thành công');
      } else {
        //  Nếu thêm mới
        const newData: TicketRecord = {
          key: (data.length + 1).toString(),
          ...values,
          created_by: values.created_by || currentUser,
          image: imageFile,
          create_at: new Date().toLocaleDateString(),
          update_at: new Date().toLocaleDateString(),
        };

        const newDataList = [...data, newData];
        //  Sắp xếp theo ngày tạo mới nhất
        const sortedDataList = newDataList.sort(
          (a: TicketRecord, b: TicketRecord) =>
            new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
        );

        setData(sortedDataList);
        setFilteredData(sortedDataList);
        message.success('Thêm mới vé thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
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
    <div className="container mx-auto py-6">
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
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        //  Thêm onRow để bắt sự kiện click vào row
        onRow={(record) => ({
          onClick: () => {
            setSelectedRecord(record);
          },
          //  Thêm style khi row được chọn
          style: {
            background:
              selectedRecord?.key === record.key ? '#e6f7ff' : 'inherit',
          },
        })}
      />

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
                <Button key="submit" type="primary" onClick={handleSave}>
                  Lưu
                </Button>,
              ]
        }
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode}
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
            <Input placeholder="Ví dụ: 50.000đ" />
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
            <DynamicReactQuill theme="snow" style={{ height: 120 }} />
          </Form.Item>

          <Form.Item name="image" label="Hình ảnh">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Tránh auto upload
            >
              <Button icon={<UploadOutlined />}>Tải lên hình vé</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketsManagement;

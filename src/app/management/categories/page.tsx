'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Input,
  Modal,
  Form,
  message,
  InputNumber,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { API_ROUTES } from '@/const/routes';
import { fdAxios } from '@/config/axios.config';
import qs from 'qs';

interface Category {
  id: number;
  name: string;
  index: number;
  posts?: { id: number; title: string }[];
}

interface CategoryRecord extends Category {
  key: string;
  posts_count: number;
}

const CategoriesManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CategoryRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<CategoryRecord | null>(
    null
  );
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState('admin');

  // Safe access to localStorage after component is mounted
  useEffect(() => {
    setMounted(true);
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUser(username);
    }
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Create query to include posts relationship
      const query = qs.stringify(
        {
          populate: ['posts'],
          sort: ['index:asc'],
        },
        {
          encodeValuesOnly: true,
        }
      );

      const response = await fdAxios.get(`${API_ROUTES.CATEGORY}?${query}`);
      const categoriesData = response.data.data;

      // Transform the data to match our component's structure
      const formattedData: CategoryRecord[] = categoriesData.map(
        (category: any) => ({
          id: category.id,
          key: category.id.toString(),
          name: category.name,
          index: category.index || 0,
          posts: category.posts || [],
          posts_count: category.posts?.length || 0,
        })
      );

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchCategories();
    }
  }, [mounted]);

  useEffect(() => {
    handleSearch();
  }, [searchText, data]);

  const showModal = () => {
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: CategoryRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      name: record.name,
      index: record.index,
    });
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (record: CategoryRecord) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá danh mục: "${record.name}"? 
                Hành động này có thể ảnh hưởng đến ${record.posts_count || 0} bài viết.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await fdAxios.delete(`${API_ROUTES.CATEGORY}/${record.id}`);
          message.success('Đã xoá danh mục thành công');
          fetchCategories();
        } catch (error) {
          console.error('Error deleting category:', error);
          message.error('Không thể xóa danh mục');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (selectedRecord) {
        // Update existing category
        await fdAxios.put(`${API_ROUTES.CATEGORY}/${selectedRecord.id}`, {
          data: {
            name: values.name,
            index: values.index || 0,
          },
        });
        message.success('Cập nhật danh mục thành công');
      } else {
        // Add new category
        await fdAxios.post(API_ROUTES.CATEGORY, {
          data: {
            name: values.name,
            index: values.index || 0,
          },
        });
        message.success('Thêm danh mục thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      message.error('Không thể lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<CategoryRecord> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'index',
      key: 'index',
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: 'Số bài viết',
      dataIndex: 'posts_count',
      key: 'posts_count',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            ghost
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  // Add check before rendering
  if (!mounted) return null;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý danh mục bài viết
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm danh mục
        </Button>
      </div>

      <div className="mb-4 flex items-center">
        <Input
          placeholder="Tìm kiếm theo tên danh mục"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className="max-w-md"
        />
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      <Modal
        title={selectedRecord ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText={selectedRecord ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            name="index"
            label="Thứ tự hiển thị"
            tooltip="Số nhỏ hơn sẽ hiển thị trước"
          >
            <InputNumber min={1} placeholder="Nhập thứ tự hiển thị" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesManagement;

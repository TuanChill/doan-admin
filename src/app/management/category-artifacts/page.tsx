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
import DynamicReactQuill from '@/components/DynamicReactQuill';

interface CategoryArtifact {
  id: number;
  name: string;
  orderIndex: number;
  description?: string;
  exhibits?: { id: number; name: string }[];
}

interface CategoryArtifactRecord extends CategoryArtifact {
  key: string;
  exhibits_count: number;
}

const CategoryArtifactManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CategoryArtifactRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] =
    useState<CategoryArtifactRecord | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<CategoryArtifactRecord[]>(
    []
  );
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

  // Fetch category artifacts from API
  const fetchCategoryArtifacts = async () => {
    try {
      setLoading(true);
      // Create query to include exhibits relationship
      const query = qs.stringify(
        {
          populate: ['exhibits'],
          sort: ['orderIndex:asc'],
        },
        {
          encodeValuesOnly: true,
        }
      );

      const response = await fdAxios.get(
        `${API_ROUTES.CATEGORY_ARTIFACT}?${query}`
      );
      const categoryData = response.data.data;

      // Transform the data to match our component's structure
      const formattedData: CategoryArtifactRecord[] = categoryData.map(
        (category: any) => ({
          id: category.id,
          key: category.id.toString(),
          name: category.name,
          orderIndex: category.orderIndex || 0,
          description: category.description || '',
          exhibits: category.exhibits || [],
          exhibits_count: category.exhibits?.length || 0,
        })
      );

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching category artifacts:', error);
      message.error('Không thể tải danh sách loại hiện vật');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchCategoryArtifacts();
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

  const handleEdit = (record: CategoryArtifactRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      name: record.name,
      orderIndex: record.orderIndex,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (record: CategoryArtifactRecord) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá loại hiện vật: "${record.name}"? 
                Hành động này có thể ảnh hưởng đến ${record.exhibits_count || 0} hiện vật.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await fdAxios.delete(`${API_ROUTES.CATEGORY_ARTIFACT}/${record.id}`);
          message.success('Đã xoá loại hiện vật thành công');
          fetchCategoryArtifacts();
        } catch (error) {
          console.error('Error deleting category artifact:', error);
          message.error('Không thể xóa loại hiện vật');
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
        // Update existing category artifact
        await fdAxios.put(
          `${API_ROUTES.CATEGORY_ARTIFACT}/${selectedRecord.id}`,
          {
            data: {
              name: values.name,
              orderIndex: values.orderIndex || 0,
              description: values.description || '',
            },
          }
        );
        message.success('Cập nhật loại hiện vật thành công');
      } else {
        // Add new category artifact
        await fdAxios.post(API_ROUTES.CATEGORY_ARTIFACT, {
          data: {
            name: values.name,
            orderIndex: values.orderIndex || 0,
            description: values.description || '',
          },
        });
        message.success('Thêm loại hiện vật thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchCategoryArtifacts();
    } catch (error) {
      console.error('Error saving category artifact:', error);
      message.error('Không thể lưu loại hiện vật');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<CategoryArtifactRecord> = [
    {
      title: 'Tên loại hiện vật',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      sorter: (a, b) => a.orderIndex - b.orderIndex,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Số hiện vật',
      dataIndex: 'exhibits_count',
      key: 'exhibits_count',
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
          Quản lý loại hiện vật
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm loại hiện vật
        </Button>
      </div>

      <div className="mb-4 flex items-center">
        <Input
          placeholder="Tìm kiếm theo tên loại hiện vật"
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
        title={selectedRecord ? 'Sửa loại hiện vật' : 'Thêm loại hiện vật'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText={selectedRecord ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên loại hiện vật"
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại hiện vật!' },
            ]}
          >
            <Input placeholder="Nhập tên loại hiện vật" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Thứ tự hiển thị"
            tooltip="Số nhỏ hơn sẽ hiển thị trước"
          >
            <InputNumber min={1} placeholder="Nhập thứ tự hiển thị" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả cho loại hiện vật"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryArtifactManagement;

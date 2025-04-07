'use client';

import { useState, useEffect } from 'react';
import { Button, Table, Input, Modal, Form, message, Spin } from 'antd';
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

interface Tag {
  id: number;
  documentId: string;
  name: string;
  posts?: { id: number; title: string }[];
}

interface TagRecord extends Tag {
  key: string;
  posts_count: number;
}

const TagsManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<TagRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<TagRecord | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<TagRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Safe access to localStorage after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch tags from API
  const fetchTags = async () => {
    try {
      setLoading(true);
      // Create query to include posts relationship
      const query = qs.stringify(
        {
          populate: ['posts'],
          sort: ['name:asc'],
        },
        {
          encodeValuesOnly: true,
        }
      );

      const response = await fdAxios.get(`${API_ROUTES.TAG}?${query}`);
      const tagsData = response.data.data;

      // Transform the data to match our component's structure
      const formattedData: TagRecord[] = tagsData.map((tag: any) => ({
        id: tag.id,
        documentId: tag.documentId || tag.id.toString(),
        key: tag.id.toString(),
        name: tag.name,
        posts: tag.posts?.data || [],
        posts_count: tag.posts?.data?.length || 0,
      }));

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error('Không thể tải danh sách thẻ tag');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchTags();
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

  const handleEdit = (record: TagRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (record: TagRecord) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá thẻ tag: "${record.name}"? 
                Hành động này có thể ảnh hưởng đến ${record.posts_count || 0} bài viết.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await fdAxios.delete(`${API_ROUTES.TAG}/${record.documentId}`);
          message.success('Đã xoá thẻ tag thành công');
          fetchTags();
        } catch (error) {
          console.error('Error deleting tag:', error);
          message.error('Không thể xóa thẻ tag');
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
        // Update existing tag
        await fdAxios.put(`${API_ROUTES.TAG}/${selectedRecord.documentId}`, {
          data: {
            name: values.name,
          },
        });
        message.success('Cập nhật thẻ tag thành công');
      } else {
        // Add new tag
        await fdAxios.post(API_ROUTES.TAG, {
          data: {
            name: values.name,
          },
        });
        message.success('Thêm thẻ tag thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      message.error('Không thể lưu thẻ tag');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<TagRecord> = [
    {
      title: 'Tên thẻ tag',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'posts_count',
      key: 'posts_count',
    },
    {
      title: 'DocumentID',
      dataIndex: 'documentId',
      key: 'documentId',
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thẻ tag</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm thẻ tag
        </Button>
      </div>

      <div className="mb-4 flex items-center">
        <Input
          placeholder="Tìm kiếm theo tên tag"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
        />
      </div>

      <Spin spinning={loading}>
        <div className="rounded-lg bg-white shadow">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedRecord(record);
              },
              style: {
                background: selectedRecord?.id === record.id ? '#e6f7ff' : '',
                cursor: 'pointer',
              },
            })}
          />
        </div>
      </Spin>

      <Modal
        title={selectedRecord ? 'Chỉnh sửa thẻ tag' : 'Thêm thẻ tag mới'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSave}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="tagForm"
          initialValues={{ name: '' }}
        >
          <Form.Item
            name="name"
            label="Tên thẻ tag"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ tag!' }]}
          >
            <Input placeholder="Nhập tên thẻ tag" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsManagement;

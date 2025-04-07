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
  Checkbox,
  Upload,
  DatePicker,
  Space,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { API_ROUTES } from '@/const/routes';
import { fdAxios } from '@/config/axios.config';
import PostContentEditor from '@/components/NewPostContentEditor';
import qs from 'qs';
import dayjs from 'dayjs';
import { ImageUpload } from '@/components/ui/image-upload';

interface Post {
  id: number;
  documentId: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorBio: string;
  view: number;
  isHighlight: boolean;
  content: {
    content: Array<{
      text?: string;
      heading?: string;
      image?: string;
      imageCaption?: string;
    }>;
  };
  image?: { data?: { id: number; attributes: { url: string; name: string } } };
  imageCaption?: string;
  category?: { data?: { id: number; attributes: { name: string } } };
  users_permissions_user?: {
    data?: { id: number; attributes: { username: string } };
  };
  tags?: { data?: Array<{ id: number; attributes: { name: string } }> };
  createdAt: string;
  updatedAt: string;
}

interface PostRecord extends Post {
  key: string;
  categoryName?: string;
  username?: string;
  tagNames?: string[];
  imageUrl?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const PostsManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<PostRecord | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    category: undefined,
    isHighlight: undefined,
  });
  const [filteredData, setFilteredData] = useState<PostRecord[]>([]);
  const [imageFile, setImageFile] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Safe initialization after component is mounted
  useEffect(() => {
    setMounted(true);
    fetchUserInfo();
  }, []);

  // Fetch posts data from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const query = qs.stringify(
        {
          populate: {
            category: {
              fields: ['name'],
            },
            users_permissions_user: {
              fields: ['username'],
            },
            tags: {
              fields: ['name'],
            },
            image: {
              fields: ['url', 'name'],
            },
          },
          sort: ['updatedAt:desc'],
        },
        {
          encodeValuesOnly: true,
        }
      );

      const response = await fdAxios.get(`${API_ROUTES.POST}?${query}`);
      const postsData = response.data.data;

      console.log(postsData);

      const formattedData: PostRecord[] = postsData.map((post: any) => {
        return {
          id: post.id,
          documentId: post.documentId || post.id.toString(),
          key: post.id.toString(),
          title: post.title || '',
          excerpt: post.excerpt || '',
          date: post.date || '',
          author: post.author || '',
          authorBio: post.authorBio || '',
          view: post.view || 0,
          isHighlight: post.isHighlight || false,
          content: post.content || { content: [] },
          imageCaption: post.imageCaption || '',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          // Relationships data
          image: post.image,
          imageUrl: post.image?.data?.attributes?.url || '',
          category: post.category,
          categoryName: post.category?.data?.attributes?.name || '',
          users_permissions_user: post.users_permissions_user,
          username:
            post.users_permissions_user?.data?.attributes?.username || '',
          tags: post.tags,
          tagNames:
            post.tags?.data?.map((tag: any) => tag.attributes.name) || [],
        };
      });

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories data
  const fetchCategories = async () => {
    try {
      const response = await fdAxios.get(`${API_ROUTES.CATEGORY}`);
      const categoriesData = response.data.data || [];

      const formattedCategories = categoriesData.map((category: any) => ({
        id: category.id,
        name: category.name,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Không thể tải danh mục');
    }
  };

  // Fetch tags data
  const fetchTags = async () => {
    try {
      const response = await fdAxios.get(`${API_ROUTES.TAG}`);
      const tagsData = response.data.data || [];

      const formattedTags = tagsData.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
      }));

      setTags(formattedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error('Không thể tải thẻ tag');
    }
  };

  // Fetch current user info
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fdAxios.get(`${API_ROUTES.ME}?populate=role`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Add a function to reset search filters
  const resetSearchFilters = () => {
    setSearchFilters({
      title: '',
      category: undefined,
      isHighlight: undefined,
    });
    // Reset filtered data to show all posts
    setFilteredData(data);
  };

  // Fetch data when component is mounted
  useEffect(() => {
    if (mounted) {
      resetSearchFilters();
      fetchPosts();
      fetchCategories();
      fetchTags();
    }
  }, [mounted]);

  // Show modal for adding new post
  const showModal = () => {
    setSelectedRecord(null);
    setIsViewMode(false);
    setImageFile('');
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      content: { content: [] },
    });
    setIsModalVisible(true);
  };

  // Handle edit post
  const handleEdit = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bài viết để sửa!');
      return;
    }

    form.setFieldsValue({
      title: selectedRecord.title,
      excerpt: selectedRecord.excerpt,
      date: selectedRecord.date ? dayjs(selectedRecord.date) : null,
      author: selectedRecord.author,
      authorBio: selectedRecord.authorBio,
      isHighlight: selectedRecord.isHighlight,
      content: selectedRecord.content,
      imageCaption: selectedRecord.imageCaption,
      categoryId: selectedRecord.category?.data?.id,
      tagIds: selectedRecord.tags?.data?.map((tag: any) => tag.id) || [],
    });

    setIsViewMode(false);
    setIsModalVisible(true);
  };

  // Handle search posts
  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const matchesTitle = item.title
        .toLowerCase()
        .includes(searchFilters.title.toLowerCase());

      const matchesCategory =
        searchFilters.category === undefined || searchFilters.category === ''
          ? true
          : item.categoryName === searchFilters.category;

      const matchesHighlight =
        searchFilters.isHighlight === undefined ||
        searchFilters.isHighlight === ''
          ? true
          : (searchFilters.isHighlight === 'true' && item.isHighlight) ||
            (searchFilters.isHighlight === 'false' && !item.isHighlight);

      return matchesTitle && matchesCategory && matchesHighlight;
    });

    setFilteredData(filtered);
  };

  // Handle view post details
  const handleView = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bài viết để xem!');
      return;
    }

    form.setFieldsValue({
      title: selectedRecord.title,
      excerpt: selectedRecord.excerpt,
      date: selectedRecord.date ? dayjs(selectedRecord.date) : null,
      author: selectedRecord.author,
      authorBio: selectedRecord.authorBio,
      isHighlight: selectedRecord.isHighlight,
      content: selectedRecord.content,
      imageCaption: selectedRecord.imageCaption,
      categoryId: selectedRecord.category?.data?.id,
      tagIds: selectedRecord.tags?.data?.map((tag: any) => tag.id) || [],
    });

    setIsViewMode(true);
    setIsModalVisible(true);
  };

  // Handle delete post
  const handleDelete = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bài viết để xoá!');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xoá',
      content: `Bạn có chắc chắn muốn xoá bài viết: "${selectedRecord.title}"?`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await fdAxios.delete(
            `${API_ROUTES.POST}/${selectedRecord.documentId}`
          );
          message.success('Xoá bài viết thành công');
          fetchPosts();
          setSelectedRecord(null);
        } catch (error) {
          console.error('Error deleting post:', error);
          message.error('Không thể xoá bài viết');
        }
      },
    });
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Save post (create or update)
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        setLoading(true);

        // Prepare data for API
        const postData: any = {
          title: values.title,
          excerpt: values.excerpt || '',
          date: values.date ? values.date.format('YYYY-MM-DD') : null,
          author: values.author,
          authorBio: values.authorBio || '',
          content: values.content,
          isHighlight: values.isHighlight || false,
          imageCaption: values.imageCaption || '',
          category: values.categoryId || null,
          users_permissions_user: currentUser?.id || null,
          tags: values.tagIds || [],
        };

        // Handle image if it exists in the form
        if (imageFile) {
          postData.image = imageFile;
        }

        if (selectedRecord) {
          // Update existing post
          await fdAxios.put(`${API_ROUTES.POST}/${selectedRecord.documentId}`, {
            data: postData,
          });
          message.success('Cập nhật bài viết thành công');
        } else {
          // Create new post
          await fdAxios.post(`${API_ROUTES.POST}`, {
            data: postData,
          });
          message.success('Thêm mới bài viết thành công');
        }

        // Refresh data
        fetchPosts();
        setIsModalVisible(false);
        form.resetFields();
      } catch (error) {
        console.error('Error saving post:', error);
        message.error('Không thể lưu bài viết');
      } finally {
        setLoading(false);
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isHighlight',
      key: 'isHighlight',
      width: 100,
      render: (isHighlight: boolean) => (
        <Tag color={isHighlight ? 'green' : 'default'}>
          {isHighlight ? 'Nổi bật' : 'Không nổi bật'}
        </Tag>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Người tạo',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'view',
      key: 'view',
      width: 100,
    },
    {
      title: 'DocumentID',
      dataIndex: 'documentId',
      key: 'documentId',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  // Helper function to get upload button
  const getUploadButton = () => (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // Add check before rendering
  if (!mounted) return null;

  return (
    <div className="mx-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
      </div>

      {/* Search and filter toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-4 bg-white p-4 shadow-sm">
        <Input
          placeholder="Tìm theo tiêu đề"
          value={searchFilters.title}
          onChange={(e) =>
            setSearchFilters({ ...searchFilters, title: e.target.value })
          }
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Danh mục"
          allowClear
          style={{ width: 180 }}
          value={searchFilters.category}
          onChange={(value) =>
            setSearchFilters({ ...searchFilters, category: value })
          }
          options={categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))}
        />
        <Select
          placeholder="Nổi bật"
          allowClear
          style={{ width: 150 }}
          value={searchFilters.isHighlight}
          onChange={(value) =>
            setSearchFilters({ ...searchFilters, isHighlight: value })
          }
          options={[
            { value: 'true', label: 'Nổi bật' },
            { value: 'false', label: 'Không nổi bật' },
          ]}
        />
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
        <Button onClick={resetSearchFilters}>Xoá bộ lọc</Button>
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

      {/* Posts table */}
      <Spin spinning={loading}>
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
              background:
                selectedRecord?.key === record.key ? '#e6f7ff' : 'inherit',
            },
          })}
        />
      </Spin>

      {/* Add/Edit Modal */}
      <Modal
        title={
          isViewMode
            ? 'Chi tiết bài viết'
            : selectedRecord
              ? 'Chỉnh sửa bài viết'
              : 'Thêm mới bài viết'
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width={900}
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
      >
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Space style={{ width: '100%' }} direction="horizontal">
            <Form.Item
              name="author"
              label="Tác giả"
              rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
              style={{ width: '400px' }}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Ngày đăng"
              rules={[{ required: true, message: 'Vui lòng chọn ngày đăng!' }]}
              style={{ width: '200px' }}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Space>

          <Form.Item name="authorBio" label="Giới thiệu tác giả">
            <Input placeholder="Nhập giới thiệu ngắn về tác giả" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Tóm tắt"
            rules={[
              { required: true, message: 'Vui lòng nhập tóm tắt bài viết!' },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập tóm tắt bài viết"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList || [];
            }}
            extra="Chỉ cho phép tải lên 1 hình ảnh đại diện (tối đa 5MB)"
          >
            <ImageUpload
              value={imageFile}
              onChange={async (file) => {
                try {
                  const formData = new FormData();
                  formData.append('files', file);

                  const response = await fetch(API_ROUTES.UPLOAD, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: formData,
                  });

                  if (!response.ok) {
                    throw new Error('Upload failed');
                  }

                  const data = await response.json();
                  if (data && data.length > 0) {
                    setImageFile(data[0].url);
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                  message.error('Không thể tải lên ảnh');
                }
              }}
              onRemove={() => {
                setImageFile('');
              }}
            />
          </Form.Item>

          <Form.Item name="imageCaption" label="Chú thích ảnh">
            <Input placeholder="Nhập chú thích cho ảnh đại diện" />
          </Form.Item>

          <Form.Item name="tagIds" label="Tags">
            <Select
              mode="multiple"
              placeholder="Chọn tags"
              style={{ width: '100%' }}
              options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
            />
          </Form.Item>

          <Form.Item name="isHighlight" valuePropName="checked">
            <Checkbox>Nổi bật</Checkbox>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung bài viết"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung bài viết!' },
            ]}
          >
            <PostContentEditor />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostsManagement;

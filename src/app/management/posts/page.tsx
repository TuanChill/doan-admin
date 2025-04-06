'use client';

import { useState } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface PostRecord {
  key: string;
  title: string;
  category: string;
  is_highlight: string;
  author: string;
  user: string;
  create_at: string;
  update_at: string;
  image?: any[];
  audio?: any[];
  content?: string;
  created_by?: string;
}

const PostsManagement = () => {
  const [data, setData] = useState<PostRecord[]>([
    {
      key: '1',
      title: 'Sự kiện quân sự 2024',
      category: 'Tin tức',
      is_highlight: 'Nổi bật',
      author: 'Nguyễn Văn A',
      user: 'admin',
      create_at: '10/03/2024',
      update_at: '12/03/2024',
    },
    {
      key: '2',
      title: 'Cuộc họp cấp cao về quốc phòng',
      category: 'Sự kiện',
      is_highlight: 'Không nổi bật',
      author: 'Trần Văn B',
      user: 'editor',
      create_at: '15/03/2024',
      update_at: '18/03/2024',
    },
    {
      key: '3',
      title: 'Diễn tập quân sự khu vực miền Bắc',
      category: 'Tin tức',
      is_highlight: 'Nổi bật',
      author: 'Lê Thị C',
      user: 'writer',
      create_at: '20/03/2024',
      update_at: '22/03/2024',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false); // State để điều khiển hiển thị modal
  const [form] = Form.useForm(); // Form instance
  const [selectedRecord, setSelectedRecord] = useState<PostRecord | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const currentUser = localStorage.getItem('username') || 'admin'; //  Lấy tên user đăng nhập
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    category: '',
    is_highlight: '',
  });
  const [filteredData, setFilteredData] = useState<PostRecord[]>(data);

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
      is_highlight: selectedRecord.is_highlight === 'Nổi bật',
      image: selectedRecord.image || [], //  Gán fileList vào form
      audio: selectedRecord.audio || [], //  Gán fileList vào form
    });

    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const matchesTitle = item.title
        .toLowerCase()
        .includes(searchFilters.title.trim().toLowerCase());

      const matchesCategory = searchFilters.category
        ? item.category === searchFilters.category
        : true;

      const matchesHighlight = searchFilters.is_highlight
        ? item.is_highlight === searchFilters.is_highlight
        : true;

      return matchesTitle && matchesCategory && matchesHighlight;
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
      is_highlight: selectedRecord.is_highlight === 'Nổi bật', // Chuyển về boolean
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
      content: `Bạn có chắc chắn muốn xoá bài viết: "${selectedRecord.title}"?`,
      okText: 'OK',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const newData = data.filter((item) => item.key !== selectedRecord.key);
        setData(newData);
        setFilteredData(newData); // Thêm dòng này để cập nhật lưới hiển thị
        setSelectedRecord(null);
        message.success('Đã xoá bài viết');
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
      const currentUser = localStorage.getItem('username') || 'admin';

      const imageFile = values.image?.fileList || [];
      const audioFile = values.audio?.fileList || [];

      if (selectedRecord) {
        //  Nếu đang sửa
        const updatedData = data.map((item) =>
          item.key === selectedRecord.key
            ? {
                ...item,
                ...values,
                is_highlight: values.is_highlight ? 'Nổi bật' : 'Không nổi bật',
                image: imageFile,
                audio: audioFile,
                update_at: new Date().toLocaleDateString(),
              }
            : item
        );

        //  Sắp xếp theo ngày cập nhật mới nhất
        const sortedData = updatedData.sort(
          (a, b) =>
            new Date(b.update_at).getTime() - new Date(a.update_at).getTime()
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Cập nhật bài viết thành công');
      } else {
        //  Nếu thêm mới
        const newData: PostRecord = {
          key: (data.length + 1).toString(),
          ...values,
          created_by: values.created_by || currentUser,
          is_highlight: values.is_highlight ? 'Nổi bật' : 'Không nổi bật',
          image: imageFile,
          audio: audioFile,
          create_at: new Date().toLocaleDateString(),
          update_at: new Date().toLocaleDateString(),
        };

        const newDataList = [...data, newData];
        //  Sắp xếp theo ngày tạo mới nhất
        const sortedDataList = newDataList.sort(
          (a, b) =>
            new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
        );

        setData(sortedDataList);
        setFilteredData(sortedDataList);
        message.success('Thêm mới bài viết thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Định nghĩa các cột cho Table
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Nổi bật',
      dataIndex: 'is_highlight',
      key: 'is_highlight',
      render: (text: string) => (
        <Tag color={text === 'Nổi bật' ? 'green' : 'default'}>{text}</Tag>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Người tạo',
      dataIndex: 'user',
      key: 'user',
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
      </div>

      {/* Thanh công cụ filter */}
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
          options={[
            { value: 'Tin tức', label: 'Tin tức' },
            { value: 'Sự kiện', label: 'Sự kiện' },
            { value: 'Thông báo', label: 'Thông báo' },
          ]}
        />
        <Select
          placeholder="Nổi bật"
          allowClear
          style={{ width: 150 }}
          value={searchFilters.is_highlight}
          onChange={(value) =>
            setSearchFilters({ ...searchFilters, is_highlight: value })
          }
          options={[
            { value: 'Nổi bật', label: 'Nổi bật' },
            { value: 'Không nổi bật', label: 'Không nổi bật' },
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
            ? 'Chi tiết bài viết'
            : selectedRecord
              ? 'Chỉnh sửa bài viết'
              : 'Thêm mới bài viết'
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
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={[
                { value: 'Tin tức', label: 'Tin tức' },
                { value: 'Sự kiện', label: 'Sự kiện' },
                { value: 'Thông báo', label: 'Thông báo' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>

          <Form.Item name="is_highlight" valuePropName="checked">
            <Checkbox>Nổi bật</Checkbox>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <ReactQuill theme="snow" style={{ height: 200 }} />
          </Form.Item>

          <Form.Item name="image" label="Hình ảnh">
            <Upload
              listType="picture"
              maxCount={5}
              beforeUpload={() => false} // Tránh auto upload
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="audio" label="Audio">
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Tải lên audio</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostsManagement;

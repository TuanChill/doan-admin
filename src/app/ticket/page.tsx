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

const QuanLyVe = () => {
  const [data, setData] = useState([
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
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const currentUser = localStorage.getItem('username') || 'admin'; //  Lấy tên user đăng nhập
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    type: '',
  });
  const [filteredData, setFilteredData] = useState(data);

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
      const matchesName = item.name
        .toLowerCase()
        .includes(searchFilters.name.trim().toLowerCase());
      const matchesType = item.type
        .toLowerCase()
        .includes(searchFilters.type.trim().toLowerCase());
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
          (a, b) => new Date(b.update_at) - new Date(a.update_at)
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Cập nhật bài viết thành công');
      } else {
        //  Nếu thêm mới
        const newData = {
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

        // Sắp xếp theo ngày tạo mới nhất
        const sortedData = newDataList.sort(
          (a, b) => new Date(b.create_at) - new Date(a.create_at)
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Thêm bài viết thành công');
      }

      setSelectedRecord(null);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Tên vé',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      sorter: (a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return priceA - priceB;
      },
      showSorterTooltip: false,
    },
    {
      title: 'Loại vé',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      sorter: (a, b) => a.type.localeCompare(b.type),
      showSorterTooltip: false,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      render: (text) => (
        <div
          style={{ textAlign: 'left', maxWidth: '300px' }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ), //đảm bảo text bên trái luôn
      sorter: (a, b) => a.description.localeCompare(b.description),
      showSorterTooltip: false,
    },
    {
      title: 'Người tạo',
      dataIndex: 'user',
      key: 'user',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      key: 'create_at',
      align: 'center',
      sorter: (a, b) => new Date(a.create_at) - new Date(b.create_at),
      showSorterTooltip: false,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'update_at',
      key: 'update_at',
      align: 'center',
      sorter: (a, b) => new Date(a.update_at) - new Date(b.update_at),
      showSorterTooltip: false,
    },
  ];

  return (
    <div className="container">
      {/* Vùng 1: Header */}
      <div className="header">
        <div className="background-image"></div>
        <h1>Quản lý vé</h1>
      </div>

      {/* Vùng 2: Tìm kiếm */}
      <div className="search-box">
        <div className="search-container">
          <Input
            placeholder="Tên vé"
            onChange={(e) =>
              setSearchFilters((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Loại vé"
            onChange={(e) =>
              setSearchFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Vùng 3: Nút chức năng + Lưới dữ liệu */}
      <div className="content">
        <div className="actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm mới
          </Button>
          <Button type="default" icon={<EditOutlined />} onClick={handleEdit}>
            Sửa
          </Button>
          <Button type="default" icon={<EyeOutlined />} onClick={handleView}>
            Xem
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowClassName={(record) =>
            selectedRecord && selectedRecord.key === record.key
              ? 'selected-row'
              : ''
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}–${range[1]} / Tổng cộng ${total} bài viết`,
            defaultPageSize: 10,
          }}
          onRow={(record) => ({
            onClick: () => setSelectedRecord(record),
          })}
        />
      </div>

      {/* Modal thêm mới */}
      <Modal
        title={
          isViewMode
            ? 'Chi tiết bài viết'
            : selectedRecord
              ? 'Chỉnh sửa bài viết'
              : 'Thêm mới bài viết'
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
          !isViewMode && (
            <Button key="save" type="primary" onClick={handleSave}>
              Lưu
            </Button>
          ),
        ]}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên vé" rules={[{ required: true }]}>
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="price" label="Giá vé" rules={[{ required: true }]}>
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <ReactQuill readOnly={isViewMode} theme="snow" />
          </Form.Item>

          <Form.Item name="type" label="Loại vé">
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="action" label="Hành động">
            <Select disabled={isViewMode} allowClear>
              <Select.Option value="Hiển thị">Hiển thị</Select.Option>
              <Select.Option value="Ẩn">Ẩn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="created_by" label="Người tạo">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* CSS nội bộ */}
      <style jsx>{`
        .container {
          padding: 20px;
        }

        /* Vùng 1: Header */
        .header {
          position: relative;
          text-align: center;
          color: white;
          padding: 50px 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 200px;
          background: url('https://xdcs.cdnchinhphu.vn/446259493575335936/2024/10/4/btlsqsvn1-1728040405546-17280404056611985378450.jpg')
            no-repeat center center;
          background-size: cover;
          filter: brightness(0.6);
          z-index: -1;
        }

        /* Vùng 2: Tìm kiếm */
        .search-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 900px;
          margin: -50px auto 20px;
          position: relative;
        }

        .search-container {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 10px;
          align-items: center;
        }

        /* Vùng 3: Nút chức năng + Lưới */
        .content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 10px;
        }

        /* Căn giữa nội dung trong bảng */
        :global(.ant-table td),
        :global(.ant-table th) {
          text-align: center !important;
        }

        /* Căn trái nội dung cột Tiêu đề */
        :global(.ant-table td:nth-child(1)),
        :global(.ant-table th:nth-child(1)) {
          text-align: left !important;
        }

        :global(.ant-table .selected-row) {
          background-color: #f0f0f0 !important; /* xám nhạt */
          font-weight: 500;
        }

        :global(.ant-table .selected-row:hover) {
          background-color: #f0f0f0 !important; /* vẫn giữ màu khi hover */
        }
      `}</style>
    </div>
  );
};

export default QuanLyVe;

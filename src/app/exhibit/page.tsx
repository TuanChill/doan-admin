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
  Upload,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuanLyHienVat = () => {
  const [data, setData] = useState([
    {
      key: '1',
      name: 'Trống đồng Đông Sơn',
      isFeatured: 'Nổi bật',
      category_artifact: 'Hiện vật khảo cổ',
      period: 'Thời kỳ Đông Sơn',
      user: 'admin',
      create_at: '01/01/2024',
      update_at: '05/01/2024',
    },
    {
      key: '2',
      name: 'Áo dài của Bác Hồ',
      isFeatured: 'Không nổi bật',
      category_artifact: 'Tư liệu lịch sử',
      period: 'Kháng chiến chống Pháp',
      user: 'editor',
      create_at: '10/02/2024',
      update_at: '15/02/2024',
    },
    {
      key: '3',
      name: 'Bản đồ Hoàng Sa - Trường Sa cổ',
      isFeatured: 'Nổi bật',
      category_artifact: 'Tư liệu địa lý',
      period: 'Thế kỷ 17',
      user: 'writer',
      create_at: '05/03/2024',
      update_at: '10/03/2024',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const currentUser = localStorage.getItem('username') || 'admin';
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    category_artifact: '',
  });
  const [filteredData, setFilteredData] = useState(data);

  const showModal = () => {
    setSelectedRecord(null);
    setIsViewMode(false);
    form.setFieldsValue({ user: currentUser });
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
      isFeatured: selectedRecord.isFeatured === 'Nổi bật',
      image: selectedRecord.image || [],
      audio: selectedRecord.audio || [],
      images: selectedRecord.images || [],
    });

    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const handleView = () => {
    if (!selectedRecord) {
      message.warning('Vui lòng chọn một bản ghi để xem!');
      return;
    }

    form.setFieldsValue({
      ...selectedRecord,
      isFeatured: selectedRecord.isFeatured === 'Nổi bật',
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
      content: `Bạn có chắc chắn muốn xoá hiện vật: "${selectedRecord.name}"?`,
      okText: 'OK',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const newData = data.filter((item) => item.key !== selectedRecord.key);
        setData(newData);
        setFilteredData(newData);
        setSelectedRecord(null);
        message.success('Đã xoá hiện vật');
      },
    });
  };

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(searchFilters.name.trim().toLowerCase());

      const matchesCategory = searchFilters.category_artifact
        ? item.category_artifact === searchFilters.category_artifact
        : true;

      return matchesName && matchesCategory;
    });

    setFilteredData(filtered);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedRecord(null);
    setIsViewMode(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      values.year = parseInt(values.year);

      const imageFile = values.image?.fileList || [];
      const audioFile = values.audio?.fileList || [];
      const imagesFile = values.images?.fileList || [];

      if (selectedRecord) {
        const updatedData = data.map((item) =>
          item.key === selectedRecord.key
            ? {
                ...item,
                ...values,
                isFeatured: values.isFeatured ? 'Nổi bật' : 'Không nổi bật',
                image: imageFile,
                audio: audioFile,
                images: imagesFile,
                update_at: new Date().toLocaleDateString(),
              }
            : item
        );

        const sortedData = updatedData.sort(
          (a, b) => new Date(b.update_at) - new Date(a.update_at)
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Cập nhật hiện vật thành công');
      } else {
        const newData = {
          key: (data.length + 1).toString(),
          ...values,
          user: currentUser,
          isFeatured: values.isFeatured ? 'Nổi bật' : 'Không nổi bật',
          image: imageFile,
          audio: audioFile,
          images: imagesFile,
          create_at: new Date().toLocaleDateString(),
          update_at: new Date().toLocaleDateString(),
        };

        const newDataList = [...data, newData];
        const sortedData = newDataList.sort(
          (a, b) => new Date(b.create_at) - new Date(a.create_at)
        );

        setData(sortedData);
        setFilteredData(sortedData);
        message.success('Thêm hiện vật thành công');
      }

      setSelectedRecord(null);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Tên hiện vật',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
    },
    {
      title: 'Loại hiện vật',
      dataIndex: 'category_artifact',
      key: 'category_artifact',
      align: 'left',
      sorter: (a, b) => a.category_artifact.localeCompare(b.category_artifact),
      showSorterTooltip: false,
    },
    {
      title: 'Giai đoạn',
      dataIndex: 'period',
      key: 'period',
      align: 'left',
      sorter: (a, b) => a.period.localeCompare(b.period),
      showSorterTooltip: false,
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      align: 'center',
      sorter: (a, b) => a.isFeatured.localeCompare(b.isFeatured),
      showSorterTooltip: false,
      render: (text) => (
        <Tag
          style={{
            borderRadius: '8px',
            padding: '2px 10px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${text === 'Nổi bật' ? '#52c41a' : '#fa8c16'}`,
            color: text === 'Nổi bật' ? '#52c41a' : '#fa8c16',
            backgroundColor: 'white',
          }}
        >
          {text}
        </Tag>
      ),
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
      <div className="header">
        <div className="background-image"></div>
        <h1>Quản lý hiện vật</h1>
      </div>

      <div className="search-box">
        <div className="search-container">
          <Input
            placeholder="Tên hiện vật"
            onChange={(e) =>
              setSearchFilters((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <Select
            placeholder="Chọn loại hiện vật"
            allowClear
            onChange={(value) =>
              setSearchFilters((prev) => ({
                ...prev,
                category_artifact: value || '',
              }))
            }
          >
            <Select.Option value="Hiện vật khảo cổ">
              Hiện vật khảo cổ
            </Select.Option>
            <Select.Option value="Tư liệu lịch sử">
              Tư liệu lịch sử
            </Select.Option>
            <Select.Option value="Tư liệu địa lý">Tư liệu địa lý</Select.Option>
            <Select.Option value="Hiện vật văn hóa">
              Hiện vật văn hóa
            </Select.Option>
          </Select>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="content">
        <div className="actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm mới
          </Button>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Sửa
          </Button>
          <Button icon={<EyeOutlined />} onClick={handleView}>
            Xem
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
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
          }
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}–${range[1]} / Tổng cộng ${total} hiện vật`,
            defaultPageSize: 10,
          }}
          onRow={(record) => ({
            onClick: () => setSelectedRecord(record),
          })}
        />
      </div>

      <Modal
        title={
          isViewMode
            ? 'Chi tiết hiện vật'
            : selectedRecord
              ? 'Chỉnh sửa hiện vật'
              : 'Thêm mới hiện vật'
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
          <Form.Item
            name="name"
            label="Tên hiện vật"
            rules={[{ required: true }]}
          >
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="period" label="Giai đoạn lịch sử">
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="location" label="Nơi lưu trữ">
            <Input disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="image" label="Ảnh đại diện">
            <Upload
              name="image"
              action="/upload.do"
              listType="picture"
              maxCount={1}
              defaultFileList={form.getFieldValue('image') || []}
            >
              <Button icon={<UploadOutlined />} disabled={isViewMode}>
                Tải ảnh lên
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="category_artifact" label="Loại hiện vật">
            <Select
              disabled={isViewMode}
              allowClear
              placeholder="Chọn loại hiện vật"
            >
              <Select.Option value="Hiện vật khảo cổ">
                Hiện vật khảo cổ
              </Select.Option>
              <Select.Option value="Tư liệu lịch sử">
                Tư liệu lịch sử
              </Select.Option>
              <Select.Option value="Tư liệu địa lý">
                Tư liệu địa lý
              </Select.Option>
              <Select.Option value="Hiện vật văn hóa">
                Hiện vật văn hóa
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="isFeatured" valuePropName="checked">
            <Checkbox disabled={isViewMode}>Nổi bật</Checkbox>
          </Form.Item>

          <Form.Item name="audio" label="Tệp âm thanh">
            <Upload
              name="audio"
              action="/upload.do"
              defaultFileList={form.getFieldValue('audio') || []}
            >
              <Button icon={<UploadOutlined />} disabled={isViewMode}>
                Tải tệp âm thanh lên
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="history" label="Lịch sử hiện vật">
            <ReactQuill readOnly={isViewMode} theme="snow" />
          </Form.Item>

          <Form.Item name="historicalSignificance" label="Giá trị lịch sử">
            <ReactQuill readOnly={isViewMode} theme="snow" />
          </Form.Item>

          <Form.Item name="year" label="Tuổi hiện vật">
            <InputNumber min={0} disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="images" label="Thư viện ảnh">
            <Upload
              name="images"
              action="/upload.do"
              listType="picture"
              multiple
              defaultFileList={form.getFieldValue('images') || []}
            >
              <Button icon={<UploadOutlined />} disabled={isViewMode}>
                Tải nhiều ảnh
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <ReactQuill readOnly={isViewMode} theme="snow" />
          </Form.Item>

          <Form.Item name="user" label="Người tạo">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .container {
          padding: 20px;
        }

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

        :global(.ant-table td),
        :global(.ant-table th) {
          text-align: center !important;
        }

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

export default QuanLyHienVat;

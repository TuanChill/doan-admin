"use client";

import { useState } from "react";
import { Button, Table, Input, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";

const QuanLyBaiViet = () => {
    const [data, setData] = useState([
        {
            key: "1",
            title: "Sự kiện quân sự 2024",
            category: "Tin tức",
            is_highlight: "Nổi bật",
            author: "Nguyễn Văn A",
            user: "admin",
            create_at: "10/03/2024",
            update_at: "12/03/2024",
        },
    ]);

    const columns = [
        { title: "Tiêu đề", dataIndex: "title", key: "title", align: "center" },
        { title: "Danh mục", dataIndex: "category", key: "category", align: "center" },
        { title: "Trạng thái", dataIndex: "is_highlight", key: "is_highlight", align: "center" },
        { title: "Tác giả", dataIndex: "author", key: "author", align: "center" },
        { title: "Người dùng", dataIndex: "user", key: "user", align: "center" },
        { title: "Ngày tạo", dataIndex: "create_at", key: "create_at", align: "center" },
        { title: "Ngày cập nhật", dataIndex: "update_at", key: "update_at", align: "center" },
    ];

    return (
        <div className="container">
            {/* Vùng 1: Header */}
            <div className="header">
                <div className="background-image"></div>
                <h1>Quản lý bài viết/ tin tức</h1>
            </div>

            {/* Vùng 2: Tìm kiếm */}
            <div className="search-box">
                <div className="search-container">
                    <Input placeholder="Tiêu đề bài viết" />
                    <Input placeholder="Danh mục" />
                    <Select placeholder="Trạng thái" style={{ width: "100%" }}>
                        <Select.Option value="highlighted">Nổi bật</Select.Option>
                        <Select.Option value="not_highlighted">Không nổi bật</Select.Option>
                    </Select>
                    <Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>
                </div>
            </div>

            {/* Vùng 3: Nút chức năng + Lưới dữ liệu */}
            <div className="content">
                <div className="actions">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
                    <Button type="default" icon={<EyeOutlined />}>Xem</Button>
                    <Button type="default" icon={<EditOutlined />}>Sửa</Button>
                    <Button type="default" danger icon={<DeleteOutlined />}>Xóa</Button>
                </div>

                <Table 
                    dataSource={data} 
                    columns={columns} 
                    pagination={{ pageSize: 10 }} 
                />
            </div>

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
                    background: url('https://xdcs.cdnchinhphu.vn/446259493575335936/2024/10/4/btlsqsvn1-1728040405546-17280404056611985378450.jpg') no-repeat center center;
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
                    grid-template-columns: 1fr 1fr 1fr auto;
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
            `}</style>
        </div>
    );
};

export default QuanLyBaiViet;

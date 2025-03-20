"use client";

import { useState } from "react";
import { Button, Table, Input, Select, Tag } from "antd";
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
        {
            key: "2",
            title: "Cuộc họp cấp cao về quốc phòng",
            category: "Sự kiện",
            is_highlight: "Không nổi bật",
            author: "Trần Văn B",
            user: "editor",
            create_at: "15/03/2024",
            update_at: "18/03/2024",
        },
        {
            key: "3",
            title: "Diễn tập quân sự khu vực miền Bắc",
            category: "Tin tức",
            is_highlight: "Nổi bật",
            author: "Lê Thị C",
            user: "writer",
            create_at: "20/03/2024",
            update_at: "22/03/2024",
        },
    ]);

    const columns = [
        { 
            title: "Tiêu đề", 
            dataIndex: "title", 
            key: "title", 
            align: "left", 
            sorter: (a, b) => a.title.localeCompare(b.title) 
        },
        { 
            title: "Danh mục", 
            dataIndex: "category", 
            key: "category", 
            align: "center",
            sorter: (a, b) => a.category.localeCompare(b.category)
        },
        { 
            title: "Trạng thái", 
            dataIndex: "is_highlight", 
            key: "is_highlight", 
            align: "center",
            sorter: (a, b) => a.is_highlight.localeCompare(b.is_highlight),
            render: (text) => (
                <Tag 
                    style={{
                        borderRadius: "8px",
                        padding: "2px 10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.15)",
                        border: `1px solid ${text === "Nổi bật" ? "#52c41a" : "#fa8c16"}`,
                        color: text === "Nổi bật" ? "#52c41a" : "#fa8c16",
                        backgroundColor: "white"
                    }}
                >
                    {text}
                </Tag>
            )
        },
        { 
            title: "Tác giả", 
            dataIndex: "author", 
            key: "author", 
            align: "center",
            sorter: (a, b) => a.author.localeCompare(b.author)
        },
        { 
            title: "Người dùng", 
            dataIndex: "user", 
            key: "user", 
            align: "center"
        },
        { 
            title: "Ngày tạo", 
            dataIndex: "create_at", 
            key: "create_at", 
            align: "center",
            sorter: (a, b) => new Date(a.create_at) - new Date(b.create_at)
        },
        { 
            title: "Ngày cập nhật", 
            dataIndex: "update_at", 
            key: "update_at", 
            align: "center",
            sorter: (a, b) => new Date(a.update_at) - new Date(b.update_at)
        },
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
                    <Select placeholder="Dan mục" style={{ width: "100%" }}>
                        <Select.Option value="highlighted">Ab</Select.Option>
                        <Select.Option value="not_highlighted">Bc</Select.Option>
                    </Select>
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

                /* Căn trái nội dung cột Tiêu đề */
                :global(.ant-table td:nth-child(1)), 
                :global(.ant-table th:nth-child(1)) {
                    text-align: left !important;
                }
            `}</style>
        </div>
    );
};

export default QuanLyBaiViet;

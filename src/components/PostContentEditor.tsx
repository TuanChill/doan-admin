'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Upload, UploadFile, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

interface ContentSection {
  heading?: string;
  text?: string;
  image?: string;
  imageCaption?: string;
}

interface PostContentEditorProps {
  value?: { content: ContentSection[] };
  onChange?: (value: { content: ContentSection[] }) => void;
  readOnly?: boolean;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const PostContentEditor: React.FC<PostContentEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});

  // Initialize when component is mounted
  useEffect(() => {
    setMounted(true);
    if (value?.content) {
      form.setFieldsValue({ sections: value.content });

      // Initialize file lists from existing images
      const initialFileList: Record<string, UploadFile[]> = {};
      value.content.forEach((section, index) => {
        if (section.image) {
          const fileName = section.image.split('/').pop() || 'image.jpg';
          initialFileList[`section-${index}`] = [
            {
              uid: `-${index}`,
              name: fileName,
              status: 'done',
              url: section.image,
            },
          ];
        }
      });
      setFileList(initialFileList);
    }
  }, [value, form]);

  // Handle form values change
  const handleValuesChange = () => {
    const formValues = form.getFieldsValue();
    const sections = formValues.sections || [];

    // Map sections to add image URLs from fileList
    const contentSections = sections.map((section: any, index: number) => {
      const sectionKey = `section-${index}`;
      const imageFile = fileList[sectionKey]?.[0];
      return {
        ...section,
        image: imageFile?.url || imageFile?.thumbUrl || section.image,
      };
    });

    if (onChange) {
      onChange({ content: contentSections });
    }
  };

  // Handle image upload
  const handleImageChange = (info: any, fieldKey: number) => {
    const sectionKey = `section-${fieldKey}`;

    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed`);
    }

    const newFileList = { ...fileList };
    newFileList[sectionKey] = info.fileList;
    setFileList(newFileList);

    // Trigger onChange to update form values
    handleValuesChange();
  };

  // Handle section reordering
  const moveSection = (
    index: number,
    direction: 'up' | 'down',
    operation: any
  ) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    operation.move(index, targetIndex);

    // Update fileList to match the new order
    const newFileList: Record<string, UploadFile[]> = {};
    Object.keys(fileList).forEach((key) => {
      const sectionIndex = parseInt(key.split('-')[1]);
      if (sectionIndex === index) {
        newFileList[`section-${targetIndex}`] = fileList[key];
      } else if (sectionIndex === targetIndex) {
        newFileList[`section-${index}`] = fileList[key];
      } else {
        newFileList[key] = fileList[key];
      }
    });
    setFileList(newFileList);

    // Trigger onChange to update form values
    handleValuesChange();
  };

  if (!mounted) return null;

  return (
    <Form
      form={form}
      disabled={readOnly}
      onValuesChange={handleValuesChange}
      initialValues={{ sections: value?.content || [] }}
    >
      <Form.List name="sections">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map((field, index) => (
              <Card
                key={field.key}
                title={`Phần ${index + 1}`}
                style={{ marginBottom: 16 }}
                extra={
                  !readOnly && (
                    <div className="flex space-x-2">
                      <Button
                        icon={<UpOutlined />}
                        onClick={() =>
                          moveSection(index, 'up', { add, remove, move })
                        }
                        disabled={index === 0}
                        size="small"
                      />
                      <Button
                        icon={<DownOutlined />}
                        onClick={() =>
                          moveSection(index, 'down', { add, remove, move })
                        }
                        disabled={index === fields.length - 1}
                        size="small"
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          remove(field.name);
                          // Remove file from fileList
                          const newFileList = { ...fileList };
                          delete newFileList[`section-${index}`];
                          setFileList(newFileList);
                          handleValuesChange();
                        }}
                        size="small"
                      />
                    </div>
                  )
                }
              >
                <Form.Item label="Tiêu đề phần" name={[field.name, 'heading']}>
                  <Input placeholder="Nhập tiêu đề phần" />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name={[field.name, 'text']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung!' },
                  ]}
                >
                  <TextArea
                    placeholder="Nhập nội dung phần"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>

                <Form.Item
                  label="Hình ảnh"
                  name={[field.name, 'imageFile']}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    fileList={fileList[`section-${field.name}`] || []}
                    onChange={(info) => handleImageChange(info, field.name)}
                    beforeUpload={(file) => {
                      // In a real app, you would upload to server here
                      // For now, just create a local URL for preview
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        const newFileList = { ...fileList };
                        newFileList[`section-${field.name}`] = [
                          {
                            uid: file.uid,
                            name: file.name,
                            status: 'done',
                            url: reader.result as string,
                          },
                        ];
                        setFileList(newFileList);
                        handleValuesChange();
                      };
                      return false; // Prevent auto upload
                    }}
                  >
                    {(!fileList[`section-${field.name}`] ||
                      fileList[`section-${field.name}`].length === 0) && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item
                  label="Chú thích hình ảnh"
                  name={[field.name, 'imageCaption']}
                >
                  <Input placeholder="Nhập chú thích cho hình ảnh" />
                </Form.Item>
              </Card>
            ))}

            {!readOnly && (
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add({ heading: '', text: '', imageCaption: '' });
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm phần nội dung
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default PostContentEditor;

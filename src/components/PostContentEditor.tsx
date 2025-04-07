'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Upload, UploadFile, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { fdAxios } from '@/config/axios.config';
import { API_ROUTES } from '@/const/routes';

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

// Add global styles for the editor
const editorStyles = {
  '.ant-form-item-label': {
    padding: 0,
    height: 'auto',
    marginBottom: '4px',
  },
  '.ant-form-item-label > label': {
    fontWeight: 500,
  },
  '.ant-form-item-required::before': {
    color: '#ff4d4f !important',
    fontSize: '14px',
    marginRight: '4px',
  },
  '.ant-upload-list-item-info': {
    padding: '0 4px',
  },
  '.ant-upload-select': {
    width: '102px !important',
    height: '102px !important',
  },
};

const PostContentEditor: React.FC<PostContentEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});
  // Add loading state for image uploads
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

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
  const handleImageChange = async (info: any, fieldKey: number) => {
    const sectionKey = `section-${fieldKey}`;

    // Log what's happening
    console.log('handleImageChange:', info.file.status, info.fileList.length);

    // Update fileList for UI only - actual upload happens in customRequest
    if (info.file.status === 'removed') {
      // When file is removed
      const newFileList = { ...fileList };
      delete newFileList[sectionKey];
      setFileList(newFileList);
    } else if (info.file.status === 'done') {
      // File was successfully uploaded via customRequest
      console.log('Upload completed in customRequest, updating UI');
    } else {
      // For other status changes, just update the UI
      const newFileList = { ...fileList };
      newFileList[sectionKey] = info.fileList;
      setFileList(newFileList);
    }
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
    <>
      <style jsx global>{`
        .post-content-editor .ant-form-item-label {
          padding: 0;
          height: auto;
          margin-bottom: 4px;
        }
        .post-content-editor .ant-form-item-label > label {
          font-weight: 500;
        }
        .post-content-editor .ant-upload-select {
          width: 102px !important;
          height: 102px !important;
          border: 1px dashed #d9d9d9;
          border-radius: 8px;
          background-color: #fafafa;
        }
        .post-content-editor .ant-upload-select:hover {
          border-color: #1890ff;
        }
        .post-content-editor .ant-upload-list-picture-card-container {
          width: 104px;
          height: 104px;
          margin-right: 8px;
          margin-bottom: 8px;
        }
        .post-content-editor .ant-form-item-extra {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 4px;
        }
        .post-content-editor .ant-form-item-required::before {
          color: #ff4d4f !important;
          font-size: 14px;
          margin-right: 4px;
        }
        .post-content-editor .required-asterisk {
          color: #ff4d4f;
          margin-left: 4px;
        }
      `}</style>
      <Form
        form={form}
        disabled={readOnly}
        onValuesChange={handleValuesChange}
        initialValues={{ sections: value?.content || [] }}
        layout="vertical"
        requiredMark={true}
        className="post-content-editor"
      >
        <Form.List name="sections">
          {(fields, { add, remove, move }) => (
            <>
              {fields.map((field, index) => (
                <Card
                  key={field.key}
                  title={
                    <span className="text-base font-medium">{`Phần ${index + 1}`}</span>
                  }
                  style={{ marginBottom: 16 }}
                  className="border border-gray-300 shadow-sm"
                  headStyle={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px 16px',
                  }}
                  bodyStyle={{ padding: '16px' }}
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
                          className="flex items-center justify-center"
                        />
                        <Button
                          icon={<DownOutlined />}
                          onClick={() =>
                            moveSection(index, 'down', { add, remove, move })
                          }
                          disabled={index === fields.length - 1}
                          size="small"
                          className="flex items-center justify-center"
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
                          className="flex items-center justify-center"
                        />
                      </div>
                    )
                  }
                >
                  <Form.Item
                    label="Tiêu đề phần"
                    name={[field.name, 'heading']}
                    className="mb-4"
                  >
                    <Input placeholder="Nhập tiêu đề phần" />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="flex items-center">
                        Nội dung <span className="required-asterisk">*</span>
                      </span>
                    }
                    name={[field.name, 'text']}
                    rules={[
                      { required: true, message: 'Vui lòng nhập nội dung!' },
                    ]}
                    className="mb-4"
                  >
                    <TextArea
                      placeholder="Nhập nội dung phần"
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      className="min-h-[100px]"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Hình ảnh"
                    name={[field.name, 'imageFile']}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    className="mb-4"
                    extra="Chỉ cho phép tải lên 1 hình ảnh cho mỗi phần (tối đa 5MB)"
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      fileList={fileList[`section-${field.name}`] || []}
                      onChange={(info) => handleImageChange(info, field.name)}
                      beforeUpload={(file) => {
                        // Validate file type - only accept images
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          message.error('Chỉ chấp nhận file hình ảnh!');
                          return Upload.LIST_IGNORE;
                        }

                        // Check file size (limit to 5MB)
                        const isLessThan5M = file.size / 1024 / 1024 < 5;
                        if (!isLessThan5M) {
                          message.error(
                            'Kích thước hình ảnh phải nhỏ hơn 5MB!'
                          );
                          return Upload.LIST_IGNORE;
                        }

                        // Return false to prevent default upload behavior
                        return false;
                      }}
                      customRequest={({ file, onSuccess, onError }) => {
                        // Kiểm tra xem file có originFileObj (rcFile) không
                        const uploadFile = file as any;
                        const rcFile = uploadFile.originFileObj || uploadFile;

                        console.log('File structure:', {
                          type: typeof file,
                          isFileInstance: file instanceof File,
                          hasOriginFileObj:
                            uploadFile.originFileObj !== undefined,
                        });

                        // Kiểm tra xem rcFile có phải là File thật không
                        if (!(rcFile instanceof File)) {
                          console.error('RcFile không hợp lệ:', rcFile);
                          message.error('File không hợp lệ');
                          onError && onError(new Error('Invalid file'));
                          return;
                        }

                        // Tạo FormData mới
                        const formData = new FormData();

                        // Log trước khi append
                        console.log('RcFile details:', {
                          name: rcFile.name,
                          size: rcFile.size,
                          type: rcFile.type,
                          lastModified: rcFile.lastModified,
                        });

                        // Dùng append để thêm file blob
                        formData.append('files', rcFile);

                        // Lưu trạng thái uploading
                        const sectionKey = `section-${field.name}`;
                        setUploading((prev) => ({
                          ...prev,
                          [sectionKey]: true,
                        }));

                        // In ra payload để debug
                        // Sử dụng cách an toàn với TypeScript
                        const entries = Array.from(formData.entries());
                        for (let i = 0; i < entries.length; i++) {
                          const [key, value] = entries[i];
                          if (value instanceof File) {
                            console.log(`${key}: File - ${value.name}`);
                          } else {
                            console.log(`${key}: ${String(value)}`);
                          }
                        }

                        // Gửi file lên Strapi bằng fetch API
                        fetch(API_ROUTES.UPLOAD, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                          },
                          body: formData,
                        })
                          .then((response) => {
                            if (!response.ok) {
                              return response.text().then((text) => {
                                try {
                                  const errorData = JSON.parse(text);
                                  throw new Error(
                                    errorData.error?.message ||
                                      `Upload failed with status ${response.status}`
                                  );
                                } catch (e) {
                                  throw new Error(
                                    `Upload failed with status ${response.status}: ${text.substring(0, 100)}`
                                  );
                                }
                              });
                            }
                            return response.json();
                          })
                          .then((data) => {
                            console.log('Upload response:', data);

                            if (data && data.length > 0) {
                              const uploadedFile = data[0];
                              const imageUrl = uploadedFile.url;

                              // Cập nhật fileList
                              const newFileList = { ...fileList };
                              newFileList[sectionKey] = [
                                {
                                  uid: `-${field.name}`,
                                  name: rcFile.name,
                                  status: 'done',
                                  url: imageUrl,
                                },
                              ];
                              setFileList(newFileList);

                              // Cập nhật form data
                              const currentValues = form.getFieldsValue();
                              const sections = [
                                ...(currentValues.sections || []),
                              ];
                              if (sections[field.name]) {
                                sections[field.name] = {
                                  ...sections[field.name],
                                  image: imageUrl,
                                };
                                form.setFieldsValue({ sections });
                              }

                              // Thông báo thành công
                              message.success(`Tải lên thành công`);

                              // Gọi onSuccess callback
                              onSuccess && onSuccess(data);

                              // Cập nhật giá trị form
                              handleValuesChange();
                            } else {
                              throw new Error('No data returned');
                            }
                          })
                          .catch((error) => {
                            console.error('Upload error:', error);
                            console.error('Error message:', error.message);
                            message.error('Lỗi tải lên: ' + error.message);
                            onError && onError(error);
                          })
                          .finally(() => {
                            // Xóa trạng thái uploading
                            setUploading((prev) => ({
                              ...prev,
                              [sectionKey]: false,
                            }));
                          });
                      }}
                      onRemove={() => {
                        // When image is removed, update fileList and form data
                        const newFileList = { ...fileList };
                        delete newFileList[`section-${field.name}`];
                        setFileList(newFileList);

                        // Get current form values and remove the image
                        const currentValues = form.getFieldsValue();
                        const sections = [...(currentValues.sections || [])];
                        if (sections[field.name]) {
                          sections[field.name] = {
                            ...sections[field.name],
                            image: undefined,
                          };
                          form.setFieldsValue({ sections });
                        }

                        handleValuesChange();
                        return true;
                      }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: !readOnly,
                        showDownloadIcon: false,
                      }}
                    >
                      {(!fileList[`section-${field.name}`] ||
                        fileList[`section-${field.name}`].length === 0) && (
                        <div className="flex flex-col items-center justify-center">
                          {uploading[`section-${field.name}`] ? (
                            <LoadingOutlined className="text-lg" />
                          ) : (
                            <PlusOutlined className="text-lg" />
                          )}
                          <div className="mt-2 text-sm">
                            {uploading[`section-${field.name}`]
                              ? 'Đang tải...'
                              : 'Tải lên'}
                          </div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Chú thích hình ảnh"
                    name={[field.name, 'imageCaption']}
                    className="mb-2"
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
                    className="flex h-12 items-center justify-center text-base"
                  >
                    <span>Thêm phần nội dung</span>
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default PostContentEditor;

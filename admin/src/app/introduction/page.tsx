'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Modal, Form, Input, Switch, Upload } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useDispatch, useSelector } from 'react-redux';
import { IntroductionActions, IntroductionSelectors } from '@/modules/introduction/slice';

// Kiểu dữ liệu cho introduction
interface Introduction {
  _id: string;
  name: string;
  type: string;
  description: string;
  images: { image: string };
  isPublic: boolean;
}

// Kiểu cho file trong Upload
type FileListType = UploadFile<{ url: string }>;

function Introduction() {
  const dispatch = useDispatch();
  const introductions: Introduction[] = useSelector(IntroductionSelectors.introductions); // Định nghĩa kiểu mảng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIntro, setCurrentIntro] = useState<Introduction | null>(null); // Introduction hoặc null
  const [fileList, setFileList] = useState<FileListType[]>([]); // Danh sách file
  const [form] = Form.useForm();

  const convertToBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async ({ fileList: newFileList }: { fileList: FileListType[] }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj) {
          const base64Image = await convertToBase64(file.originFileObj);
          return {
            ...file,
            url: base64Image,
          };
        }
        return file;
      })
    );

    setFileList(updatedFileList);
    const image = updatedFileList[0]?.url || ''; // Chỉ lấy ảnh đầu tiên
    form.setFieldsValue({ images: image });
  };

  const handleEdit = (intro: Introduction) => {
    setCurrentIntro(intro);
    form.setFieldsValue({
      ...intro,
      images: intro.images.image,
    });
    setFileList([
      {
        uid: '-1',
        name: 'image',
        status: 'done',
        url: intro.images.image,
      } as FileListType,
    ]);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, images: { image: fileList[0]?.url || '' } };

      if (currentIntro) {
        dispatch(IntroductionActions.updateIntroduction({ id: currentIntro._id, data: payload }));
      } else {
        dispatch(IntroductionActions.createIntroduction(payload));
      }
      setIsModalOpen(false);
      setFileList([]);
    } catch (error) {
      console.error('Error saving introduction:', error);
    }
  };

  useEffect(() => {
    dispatch(IntroductionActions.fetchIntroductions());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Introduction Management</h1>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setCurrentIntro(null);
          setFileList([]);
          setIsModalOpen(true);
        }}
      >
        Thêm mới Introduction
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {introductions.map((intro) => (
          <Card
            key={intro._id}
            title={intro.name}
            extra={
              <div className="flex items-center gap-2">
                <Switch checked={intro.isPublic} />
                <Button type="link" onClick={() => handleEdit(intro)}>
                  Sửa
                </Button>
              </div>
            }
          >
            <p>Loại: {intro.type}</p>
            <p>Mô tả: {intro.description}</p>
            <img src={intro.images.image} alt={intro.name} style={{ width: '100%', objectFit: 'cover' }} />
          </Card>
        ))}
      </div>

      <Modal
        title={currentIntro ? 'Chỉnh sửa Introduction' : 'Thêm mới Introduction'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Tên là bắt buộc!' }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true, message: 'Loại là bắt buộc!' }]}>
            <Input placeholder="Nhập loại" />
          </Form.Item>
          <Form.Item name="images" label="Ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageChange}
              onRemove={() => setFileList([])}
            >
              {fileList.length < 1 && (
                <div>
                  <p>+</p>
                  <p>Upload</p>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Mô tả là bắt buộc!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
          <Form.Item
            name="isPublic"
            label="Công khai"
            valuePropName="checked"
            rules={[{ required: false }]} // Không bắt buộc
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Introduction;

"use client";
import { ProductSelectors } from "@/modules/product/slice";
import { App, Form, Input, Modal, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserList from "./components/UserList";
import { CustomerActions, CustomerSelectors } from "@/modules/customer/slice";

const UserControlPage: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector(CustomerSelectors.customer) || [];
  const loading = useSelector(ProductSelectors.isLoading);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUser, setEditUser] = useState<null | any>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    dispatch(CustomerActions.getCustomer({}));
  }, [dispatch]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user: any) =>
      user.username.toLowerCase().includes(filter.toLowerCase())
    )
    : [];


  const handleAddUser = async (newUser: any) => {
    // await dispatch(CustomerActions.createUser({ data: newUser }));
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditButtonClick = async (user: any) => {
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        phoneNumber: user.profile?.phoneNumber,
      }
    });

    setEditUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(CustomerActions.deleteCustomer({ id: userId }));
          dispatch(CustomerActions.getCustomer({}));
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa người dùng");
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const userData = { ...values };
      if (editUser) {
        // Update user
        await dispatch(
          CustomerActions.updateCustomer({ id: editUser._id, data: userData, })
        );
      } else {
        await handleAddUser(userData);
      }
      handleCancel();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditUser(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-8">
        <div className="space-y-6">
          <App>
            <Input
              placeholder="Search Users"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: 300, marginBottom: "20px" }}
            />

            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Add User
            </Button>

            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              <UserList
                users={filteredUsers}
                loading={loading}
                onEdit={handleEditButtonClick}
                onDelete={handleDeleteUser}
              />
            ) : (
              <div>No users found or error loading users.</div>
            )}
          </App>
        </div>
      </div>

      <Modal
        title={editUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editUser ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name={["profile", "firstName"]}
            rules={[{ required: true, message: "Please input the first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name={["profile", "lastName"]}
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name={["profile", "phoneNumber"]}
            rules={[{ required: true, message: "Please input the phone number!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserControlPage;

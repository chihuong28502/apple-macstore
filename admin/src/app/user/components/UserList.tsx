import { Button, Table } from 'antd';

function UserList({ users, loading, onEdit, onDelete }: any) {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'First Name',
      dataIndex: ['profile', 'firstName'],
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: ['profile', 'lastName'],
      key: 'lastName',
    },
    {
      title: 'Phone Number',
      dataIndex: ['profile', 'phoneNumber'],
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: any) => (
        <div className="flex justify-center">
          <Button onClick={() => onEdit(user)} type="primary" className="mr-2">
            Edit
          </Button>
          <Button onClick={() => onDelete(user._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Table
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default UserList;

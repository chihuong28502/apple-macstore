import { Button, Table } from 'antd';

function Categories({ categories, loading, onEdit, onDelete }: any) {
  const sortedCategories = [...categories].sort((a: any, b: any) => {
    if (a.parentCategoryId === null && b.parentCategoryId !== null) {
      return -1;
    }
    if (a.parentCategoryId !== null && b.parentCategoryId === null) {
      return 1;
    }
    return 0;
  });

  const parentCategories = categories.reduce((acc: any, category: any) => {
    if (category._id && category.name) {
      acc[category._id] = category.name;
    }
    return acc;
  }, {});

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category cha',
      dataIndex: 'parentCategoryId',
      key: 'parentCategoryId',
      render: (parentCategoryId: any) => {
        return parentCategoryId ? parentCategories[parentCategoryId] : 'No Parent';
      }
    },
    {
      title: 'Breadcrumbs',
      dataIndex: 'breadcrumbs',
      key: 'breadcrumbs',
      render: (breadcrumbs: any) => breadcrumbs ? breadcrumbs.join(" > ") : 'No Breadcrumbs',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, category: any) => (
        <div className='flex justify-center'>
          <Button
            onClick={() => onEdit(category)}
            type="primary"
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(category._id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Table
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={sortedCategories}
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default Categories;

import React from 'react';
import { Table, Button } from 'antd';

function Categories({ categories, loading, onEdit, onDelete }: any) {
  // Sắp xếp danh mục: các danh mục không có cha sẽ được xếp lên đầu
  const sortedCategories = [...categories].sort((a: any, b: any) => {
    if (a.parentCategoryId === null && b.parentCategoryId !== null) {
      return -1; // a không có cha, đưa lên đầu
    }
    if (a.parentCategoryId !== null && b.parentCategoryId === null) {
      return 1; // b không có cha, đưa lên đầu
    }
    return 0; // nếu cả 2 đều có hoặc không có cha thì giữ nguyên thứ tự
  });

  // Tạo một bảng tra cứu cho tên danh mục cha dựa trên `parentCategoryId`
  const parentCategories = categories.reduce((acc: any, category: any) => {
    if (category._id && category.name) {
      acc[category._id] = category.name;  // Lưu trữ tên danh mục theo ID
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
      title: 'Parent Category',
      dataIndex: 'parentCategoryId',
      key: 'parentCategoryId',
      render: (parentCategoryId: any) => {
        // Lấy tên danh mục cha (nếu có)
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
        <div>
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
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <Table
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

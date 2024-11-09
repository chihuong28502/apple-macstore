'use client'
import { ProductActions, ProductSelectors } from '@/modules/product/slice'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Input, Modal, Form, message, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

function Page() {
  const dispatch = useDispatch()
  const variants = useSelector(ProductSelectors.variant)
  const params: any = useParams()

  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingVariant, setEditingVariant] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')

  // Create a reference for the form
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(ProductActions.fetchVariantByProductId(params.id))
  }, [dispatch, params.id])

  // Define columns for Ant Design Table with sorting and search
  const columns = [
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      sorter: (a: any, b: any) => a.color.localeCompare(b.color),
      // Filter by selected color
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          {variants
            .map((variant: any) => variant.color)
            .filter((value, index, self) => self.indexOf(value) === index) // Unique colors
            .map((color: string) => (
              <Tag
                key={color}
                color="blue"
                onClick={() => handleColorFilter(color)}
                style={{ cursor: 'pointer', marginBottom: 4 }}
              >
                {color}
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: 'CODE COLOR',
      dataIndex: 'colorCode',
      key: 'colorCode',
    },
    {
      title: 'RAM',
      dataIndex: 'ram',
      key: 'ram',
      sorter: (a: any, b: any) => a.ram.localeCompare(b.ram),
    },
    {
      title: 'SSD',
      dataIndex: 'ssd',
      key: 'ssd',
      sorter: (a: any, b: any) => a.ssd.localeCompare(b.ssd),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `$${text}`, // Formatting price with a dollar sign
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded ${status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ]

  // Function to handle editing a variant
  const handleEdit = (variant: any) => {
    setEditingVariant(variant)
    setIsModalVisible(true)
    form.setFieldsValue(variant) // Set initial values in the form
  }

  // Function to handle deleting a variant
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa variant này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          dispatch(ProductActions.deleteVariant({ id: id, productId: params.id }))
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa người dùng");
        }
      },
    });
  }

  const handleModalSave = (values: any) => {
    if (editingVariant) {
      dispatch(ProductActions.updateVariant({ id: editingVariant._id, data: values, productId: params.id }))
      form.resetFields()
      message.success('Variant updated successfully')
    } else {
      const data = { ...values, productId: params.id }
      dispatch(ProductActions.createVariantByProduct(data))
      form.resetFields()
    }
    setIsModalVisible(false)
  }

  const handleColorFilter = (color: string) => {
    setSelectedColor(color === selectedColor ? '' : color) // Toggle color filter
  }

  const filteredVariants = variants.filter((variant: any) =>
    (selectedColor ? variant.color === selectedColor : true) &&
    Object.values(variant)
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Product Variants</h1>

      {/* Search and Add Button */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search across all fields"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => handleEdit(null)} // Open modal for adding new variant
        >
          Add Variant
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredVariants || []}
        rowKey="_id"
        pagination={false}
        bordered
      />

      {/* Modal for Editing/Adding Variant */}
      <Modal
        title={editingVariant ? 'Edit Variant' : 'Add Variant'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields() // Reset the form fields when modal is closed
        }}
        footer={null}
      >
        <Form
          form={form} // Bind the form instance
          initialValues={editingVariant || {}}
          onFinish={handleModalSave}
          layout="vertical"
        >
          <Form.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: 'Please enter the color' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Color Code"
            name="colorCode"
            rules={[{ required: true, message: 'Please enter the CODE COLOR' }]}
          >
            <Input />
          </Form.Item>
          

          <Form.Item
            label="RAM"
            name="ram"
            rules={[{ required: true, message: 'Please enter the RAM size' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="SSD"
            name="ssd"
            rules={[{ required: true, message: 'Please enter the SSD size' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: 'Please enter the stock quantity' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Input />
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={() => {
              setIsModalVisible(false)
              form.resetFields() // Reset fields on cancel
            }} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default Page

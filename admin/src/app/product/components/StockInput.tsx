import { InputNumber, Table } from "antd";
import { useEffect, useState } from "react";

export const StockInput: React.FC<{
  specifications: {
    colors: string[];
    storageOptions: string[];
    ramOptions: string[];
  };
  value?: Record<string, Record<string, Record<string, { quantity: number; price: number; basePrice: number }>>>;  
  onChange?: (value: Record<string, Record<string, Record<string, { quantity: number; price: number; basePrice: number }>>>) => void;
}> = ({ specifications, value, onChange }) => {
  const [stockData, setStockData] = useState<Record<string, Record<string, Record<string, { quantity: number; price: number; basePrice: number }>>>>(value || {});

  useEffect(() => {
    if (value) {
      setStockData(value);
    }
  }, [value]);

  const columns = [
    {
      title: "Cấu hình",
      dataIndex: "config",
      key: "config",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity", 
      key: "quantity",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.quantity}
          onChange={(quantity) => 
            handleStockChange(record.color, record.ram, record.storage, quantity || 0, record.price, record.basePrice) // Thêm basePrice ở đây
          }
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          value={record.price}
          onChange={(price) =>
            handleStockChange(record.color, record.ram, record.storage, record.quantity, price || 0, record.basePrice) // Thêm basePrice ở đây
          }
        />
      ),
    }, 
    {
      title: "Giá gốc",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          value={record.basePrice}
          onChange={(basePrice) =>
            handleStockChange(record.color, record.ram, record.storage, record.quantity, record.price, basePrice || 0) // Thêm price ở đây
          }
        />
      ),
    },
  ];

  // Generate data từ specifications
  const data = specifications.colors.flatMap((color) =>
    specifications.ramOptions.flatMap((ram) =>
      specifications.storageOptions.map((storage) => {
        const existingData = stockData[color]?.[ram]?.[storage] || { 
          quantity: 0, 
          price: 0 ,
          basePrice: 0 
        };
        
        return {
          key: `${color}-${ram}-${storage}`,
          color,
          ram,
          storage,
          config: `${ram} GB - ${storage} GB`,
          quantity: existingData.quantity,
          price: existingData.price,
          basePrice: existingData.basePrice,
        };
      })
    )
  );

  const handleStockChange = (
    color: string,
    ram: string, 
    storage: string,
    quantity: number,
    price: number,
    basePrice: number,
  ) => {
    const newStockData = { ...stockData };

    // Khởi tạo cấu trúc nested nếu chưa tồn tại
    if (!newStockData[color]) {
      newStockData[color] = {};
    }
    if (!newStockData[color][ram]) {
      newStockData[color][ram] = {};
    }

    // Cập nhật hoặc xóa data
    if (quantity > 0 || price > 0 || basePrice > 0) { // Cần kiểm tra basePrice
      newStockData[color][ram][storage] = {
        quantity,
        price,
        basePrice
      };
    } else {
      delete newStockData[color][ram][storage];
      // Dọn dẹp các object rỗng
      if (Object.keys(newStockData[color][ram]).length === 0) {
        delete newStockData[color][ram];
      }
      if (Object.keys(newStockData[color]).length === 0) {
        delete newStockData[color];
      }
    }

    setStockData(newStockData);
    onChange?.(newStockData);
  };

  return (
    <div className="space-y-4">
      {specifications.colors.map((color) => (
        <div key={color} className="border p-4 rounded">
          <h3 className="font-semibold mb-2">{color}</h3>
          <Table
            columns={columns}
            dataSource={data.filter((item) => item.color === color)}
            pagination={false}
            size="small"
          />
        </div>
      ))}
    </div>
  );
};

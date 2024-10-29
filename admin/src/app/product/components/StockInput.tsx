import { InputNumber, Table } from "antd";
import { useEffect, useState } from "react";

// Component quản lý stock
export const StockInput: React.FC<{
  specifications: {
    colors: string[];
    storageOptions: string[];
    ramOptions: string[];
  };
  value?: Map<string, Map<string, { quantity: number; price: number }>>;
  onChange?: (value: Map<string, Map<string, { quantity: number; price: number }>>) => void;
}> = ({ specifications, value, onChange }) => {
  const [stockMap, setStockMap] = useState<Map<string, Map<string, { quantity: number; price: number }>>>(
    value || new Map()
  );

  // Cập nhật stockMap khi giá trị props value thay đổi
  useEffect(() => {
    if (value) {
      setStockMap(value);
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
            handleStockChange(record.color, record.config, quantity || 0, record.price)
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
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          onChange={(price) =>
            handleStockChange(record.color, record.config, record.quantity, price || 0)
          }
        />
      ),
    },
  ];

  const data = specifications.colors.flatMap((color) =>
    specifications.ramOptions.flatMap((ram) =>
      specifications.storageOptions.map((storage) => {
        const config = `${ram}-${storage}`;
        const stockInfo = stockMap.get(color)?.get(config) || { quantity: 0, price: 0 };
        return {
          key: `${color}-${config}`,
          color,
          config,
          quantity: stockInfo.quantity,
          price: stockInfo.price,
        };
      })
    )
  );

  const handleStockChange = (
    color: string,
    config: string,
    quantity: number,
    price: number
  ) => {
    const newStockMap = new Map(stockMap);

    if (!newStockMap.has(color)) {
      newStockMap.set(color, new Map());
    }

    const colorMap = newStockMap.get(color)!;
    colorMap.set(config, { quantity, price });

    setStockMap(newStockMap);
    onChange?.(newStockMap);
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

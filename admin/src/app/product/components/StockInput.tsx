"use client";
import { InputNumber, Table } from "antd";
import { useState, useEffect } from "react";

// Component quản lý stock
export const StockInput: React.FC<{
  specifications: {
    colors: string[];
    storageOptions: string[];
    ramOptions: string[];
  };
  value?: Map<string, Map<string, number>>;
  onChange?: (value: Map<string, Map<string, number>>) => void;
}> = ({ specifications, value, onChange }) => {
  const [stockMap, setStockMap] = useState<Map<string, Map<string, number>>>(
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
            handleStockChange(record.color, record.config, quantity || 0)
          }
        />
      ),
    },
  ];

  const data = specifications.colors.flatMap((color) =>
    specifications.ramOptions.flatMap((ram) =>
      specifications.storageOptions.map((storage) => {
        const config = `${ram}-${storage}`;
        return {
          key: `${color}-${config}`,
          color,
          config,
          quantity: stockMap.get(color)?.get(config) || 0,
        };
      })
    )
  );

  const handleStockChange = (
    color: string,
    config: string,
    quantity: number
  ) => {
    const newStockMap = new Map(stockMap);

    if (!newStockMap.has(color)) {
      newStockMap.set(color, new Map());
    }

    const colorMap = newStockMap.get(color)!;
    colorMap.set(config, quantity);

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

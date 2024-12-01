import { Button } from "antd";
import React from "react";

const QuantitySelector = ({ selectedVariant, quantity, setQuantity }: any) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < selectedVariant?.availableStock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Button
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span style={{ minWidth: "32px", textAlign: "center" }}>{quantity}</span>
      <Button
        onClick={handleIncrease}
        disabled={quantity >= selectedVariant?.availableStock}
      >
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;

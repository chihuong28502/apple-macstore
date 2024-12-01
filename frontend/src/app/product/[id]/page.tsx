'use client'
import { AuthSelectors } from "@/modules/auth/slice";
import { CartActions } from "@/modules/cart/slice";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import { Image as AntImage, Button, Card, Col, Divider, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "./components/Quantity";
import Reviews from "./components/Review";

const { Meta } = Card;

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const productId = params.id;
  const productById = useSelector(ProductSelectors.product);
  const auth = useSelector(AuthSelectors.user);

  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedRam, setSelectedRam] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(ProductActions.fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productById?.images?.length) {
      setMainImage(productById.images[0].image);
    }
  }, [productById]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedRam || !selectedStorage) return;

    const selectedVariant = productById?.variants.find(
      (variant: any) =>
        variant.color === selectedColor &&
        variant.ram === selectedRam &&
        variant.ssd === selectedStorage
    );

    if (selectedVariant) {
      dispatch(
        CartActions.addProductToCart({
          id: auth._id,
          item: {
            productId: productId,
            variantId: selectedVariant._id,
            quantity: Math.min(quantity, selectedVariant.availableStock),
          },
        })
      );
    }
  };

  const variantsByColor = productById?.variants.filter((variant: any) => variant.color === selectedColor);

  const availableRams = Array.from(
    new Set(variantsByColor?.map((variant: any) => variant.ram))
  );

  const availableStorages = Array.from(
    new Set(
      variantsByColor
        ?.filter((variant: any) => variant.ram === selectedRam)
        .map((variant: any) => variant.ssd)
    )
  );

  const selectedVariant = productById?.variants.find(
    (variant: any) =>
      variant.color === selectedColor &&
      variant.ram === selectedRam &&
      variant.ssd === selectedStorage
  );

  return (
    <div className="min-h-screen py-8 px-4 max-w-6xl mx-auto">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <AntImage
            src={mainImage}
            alt={productById?.name}
            className="rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-4 overflow-auto">
            {productById?.images.map((img: any, index: any) => (
              <AntImage
                key={index}
                width={64}
                height={64}
                src={img.image}
                alt={`Product Image ${index}`}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setMainImage(img.image)}
              />
            ))}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Meta
              title={<h2 className="text-xl font-bold">{productById?.name}</h2>}
              description={<p className="text-gray-600">{productById?.description}</p>}
            />
            <Divider />

            {/* Colors */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Colors</h3>
              <div className="flex gap-2">
                {Array.from(
                  new Map(
                    productById?.variants.map((v: any) => [v.color, v.colorCode])
                  )
                ).map(([color, colorCode]: any) => (
                  <Tooltip title={color} key={color}>
                    <button
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                        }`}
                      style={{ backgroundColor: colorCode }}
                      onClick={() => setSelectedColor(color)}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* RAM */}
            {selectedColor && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Available RAM</h3>
                <div className="flex gap-2">
                  {availableRams.map((ram: any, index) => (
                    <Button
                      key={index}
                      type={selectedRam === ram ? "primary" : "default"}
                      onClick={() => setSelectedRam(ram)}
                    >
                      {ram}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {selectedColor && selectedRam && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Available Storage</h3>
                <div className="flex gap-2">
                  {availableStorages.map((ssd: any, index) => (
                    <Button
                      key={index}
                      type={selectedStorage === ssd ? "primary" : "default"}
                      onClick={() => setSelectedStorage(ssd)}
                    >
                      {ssd}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Stock */}
            {selectedVariant && (
              <div className="mt-4">
                <p className="text-lg font-bold">
                  Price:{" "}
                  {selectedVariant.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <p>Available Stock: {selectedVariant.availableStock}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-4">
              <QuantitySelector
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
              />
              <Button
                type="primary"
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedRam || !selectedStorage}
              >
                Add to Cart
              </Button>
            </div>
            <Reviews />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

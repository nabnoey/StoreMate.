import { describe, it, expect } from "vitest";

it("ควรคำนวณราคารวมถูกต้องเมื่อมีหลายสินค้า", () => {
  const selectedCartItems = [
    { product: { price: 100 }, quantity: 2 },
    { product: { price: 50 }, quantity: 1 },
  ];

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  expect(subtotal).toBe(250);
});

it("ควรได้ 0 เมื่อไม่มีสินค้า", () => {
  const selectedCartItems: any[] = [];

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  expect(subtotal).toBe(0);
});

it("ควรคำนวณถูกต้องเมื่อมีสินค้า 1 ชิ้น", () => {
  const selectedCartItems = [{ product: { price: 200 }, quantity: 1 }];

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  expect(subtotal).toBe(200);
});

it("ควรได้ 0 เมื่อ quantity = 0", () => {
  const items = [{ product: { price: 100 }, quantity: 0 }];

  const subtotal = items.reduce(
    (sum, items) => sum + items.product.price * items.quantity,
    0,
  );
  expect(subtotal).toBe(0);
  console.table(items);
});

it("คำนวณเฉพาะสินค้าที่ถูกเลือกในตะกร้า", () => {
  const items = [
    { product: { price: 100 }, quantity: 2 },
    { product: { price: 150 }, quantity: 3 },
    { product: { price: 50 }, quantity: 5 },
  ];
  const selectedItems = [items[2]];

  const subtotal = selectedItems.reduce(
    (sum, items) => sum + items.product.price * items.quantity,
    0,
  );

  expect(subtotal).toBe(250);
  console.table(selectedItems);
});

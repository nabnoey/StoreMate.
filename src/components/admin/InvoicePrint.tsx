import React from "react";
import type {InvoicePrintData} from "../../types/moderator/InvoicePrint";
import type { OrderMod} from "../../types/moderator/ordersMod";
interface InvoicePrintProps {
  data: InvoicePrintData[];
    // order: OrderMod[];
}
interface OrderItem {
  order: OrderMod[];
}

const forceColor: React.CSSProperties = {
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
};

const blackLabelStyle: React.CSSProperties = {
  ...forceColor,
  display: "inline-block",
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "3px 18px",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "8px",
  letterSpacing: "0.5px",
};

const blackBarStyle: React.CSSProperties = {
  ...forceColor,
  backgroundColor: "#000000",
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "600",
  padding: "4px 10px",
  marginBottom: "8px",
};

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ data }, ref) => {
    if (!data || data.length === 0) return null;

    return (
      <div
        ref={ref}
        style={{
          ...forceColor,
          width: "100%",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        {data.map((order, index) => (
          <React.Fragment key={order.orderNo || index}>
            {/* แต่ละบิล */}
            <div
              style={{
                ...forceColor,
                width: "680px",
                margin: "0 auto",
                padding: "16px 0 12px 0",
                pageBreakInside: "avoid",
              }}
            >
              {/* ผู้ส่ง / ผู้รับ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                  marginBottom: "10px",
                  lineHeight: "1.7",
                }}
              >
                {/* ผู้ส่ง */}
                <div>
                  <div style={blackLabelStyle}>ผู้ส่ง</div>
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>พัดทอง</div>
                  <div style={{ fontSize: "12px" }}>099-999-9999</div>
                  <div style={{ fontSize: "12px", color: "#222", marginTop: "2px" }}>
                    199 ม.6 ต.ดอนกระเบื้อง อ.โพธาราม
                    <br />
                    จ.ราชบุรี 70120
                  </div>
                </div>

                {/* ผู้รับ */}
{/* ส่วนผู้รับ */}
<div style={{ fontSize: "12px", fontWeight: "600" }}>
  {order.receiverInfo?.name || "สมชาย ใจดี"}
</div>
<div style={{ fontSize: "12px" }}>
  {order.receiverInfo?.phone || "098-3809919"}
</div>
<div style={{ fontSize: "12px", color: "#222", marginTop: "2px" }}>
  {order.receiverInfo?.address || "ที่อยู่ผู้รับ"}
</div>

{/* ส่วนรายการสินค้า */}
{order.shippingItems && order.shippingItems.length > 0 ? (
  order.shippingItems.map((item, idx) => (
    <div key={idx} /* ... */>
      <span>{idx + 1}. {item.productName}</span>
      {/* ... */}
      <span>x{item.quantity}</span>
      <span>฿ {item.price.toLocaleString()}</span>
    </div>
  ))
) : (
  <div>ไม่มีรายการสินค้า</div>
)}
              </div>

              {/* แถบเลข order ดำเต็มแนว */}
              <div style={blackBarStyle}>
                หมายเลขออเดอร์: {order.orderNo || "ORD-2026-001"}
              </div>

              {/* รายการสินค้า */}
              <div style={{ fontSize: "12px", marginBottom: "12px" }}>
                { order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ flex: 1, paddingRight: "16px" }}>
                        {idx + 1}. {item.productName}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "32px",
                          minWidth: "90px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <span>x{item.quantity}</span>
                        <span style={{ minWidth: "40px", textAlign: "right" }}>
                          ฿ {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>ไม่มีรายการสินค้า</div>
                )}
              </div>

              {/* สรุปท้ายบิล */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  fontSize: "11px",
                  paddingTop: "2px",
                }}
              >
                <div>
                  <div style={{ color: "#555" }}>ค่าขนส่ง</div>
                  <div style={{ marginTop: "3px" }}>฿ 0</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#555" }}>มูลค่าสินค้า</div>
                  <div style={{ marginTop: "3px" }}>
                    ฿ {order.total?.toLocaleString() || "0"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#555" }}>ช่องทางชำระเงิน</div>
                  <div style={{ marginTop: "3px", fontWeight: "500" }}>
                    {order.checkoutType === "PROMPTPAY" ? "พร้อมเพย์ (PromptPay)" : order.checkoutType || "พร้อมเพย์ (PromptPay)"}
                  </div>
                </div>
              </div>
            </div>

            {/* เส้นประคั่นระหว่าง order */}
            {index !== data.length - 1 && (
              <div
                style={{
                  width: "680px",
                  margin: "0 auto",
                  borderTop: "1.5px dashed #888888",
                  ...forceColor,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";
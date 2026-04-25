import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";
import { setPaymentStatus } from "../redux/payment/paymentReducer";

const usePaymentSocket = (token?: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("https://api.store-mate-api.me/ws"),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      // debug: (str) => {
      //   // console.log("STOMP DEBUG:", str);
      // },

      onConnect: () => {
        // แนะนำให้ใช้ console.log แทน toast เพื่อไม่ให้รบกวนหน้าจอลูกค้า
        console.log("เชื่อมต่อ WebSocket สำเร็จแล้ว รอรับแจ้งเตือน...");

        stompClient.subscribe("/user/queue/notifications", (message) => {
          if (message.body) {
            try {
              const data = JSON.parse(message.body);

              // ใช้ console.log เพื่อดูข้อมูลดิบหลังบ้าน
              console.log("ได้รับการแจ้งเตือนจาก Backend:", data);

              if (
                data.paymentStatus === "SUCCESS" ||
                data.status === "COMPLETED"
              ) {
                // แจ้งเตือนผ่าน Toast ว่าสำเร็จ (ให้ลูกค้าเห็น)
                toast.success("ชำระเงินสำเร็จ!", { duration: 3000 });

                localStorage.removeItem("orderNo");

                // อัปเดต Redux เพื่อให้ UI เปลี่ยนหน้า
                dispatch(
                  setPaymentStatus({
                    status: "SUCCESS",
                    orderId: data.orderNo || data.orderId,
                  }),
                );
              } else if (
                data.paymentStatus === "FAILED" ||
                data.status === "CANCELLED"
              ) {
                // แจ้งเตือนกรณีชำระเงินไม่สำเร็จ
                toast.error("การชำระเงินไม่สำเร็จ หรือถูกยกเลิก", {
                  duration: 3000,
                });

                // อัปเดต Redux ให้เป็น FAILED เผื่อเอาไปจัดการ UI ต่อ
                dispatch(
                  setPaymentStatus({
                    status: "FAILED",
                    orderId: data.orderNo || data.orderId,
                  }),
                );
              }
            } catch (error) {
              console.error(
                "ไม่สามารถแปลงข้อมูล WebSocket เป็น JSON ได้",
                error,
              );
            }
          }
        });
      },

      onStompError: (frame) => {
        console.error("STOMP Error พบข้อผิดพลาด:", frame.headers["message"]);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket Error:", event);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
      console.log("ปิดการเชื่อมต่อ WebSocket แล้ว");
    };
  }, [dispatch, token]);
};

export default usePaymentSocket;

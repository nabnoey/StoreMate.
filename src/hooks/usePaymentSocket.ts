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
      webSocketFactory: () => new SockJS(import.meta.env.VITE_SOCKET_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        stompClient.subscribe("/user/queue/notifications", (message) => {
          if (message.body) {
            try {
              const data = JSON.parse(message.body);

              const currentOrder = localStorage.getItem("orderNo");

              if (data.orderNo && data.orderNo !== currentOrder) {
                return;
              }

              if (
                data.paymentStatus === "PAYMENT_SUCCESS" ||
                data.status === "COMPLETED"
              ) {
                if (data.orderNo && data.orderNo !== currentOrder) {
                  return;
                }
                toast.success("ชำระเงินสำเร็จ!", { duration: 3000 });

                localStorage.removeItem("orderNo");

                dispatch(
                  setPaymentStatus({
                    status: "PAYMENT_SUCCESS",
                    orderId: data.orderNo || data.orderId,
                  }),
                );
              } else if (
                data.paymentStatus === "PAYMENT_FAILS" ||
                data.status === "CANCELLED"
              ) {
                toast.error("การชำระเงินไม่สำเร็จ หรือถูกยกเลิก", {
                  duration: 3000,
                });

                dispatch(
                  setPaymentStatus({
                    status: "PAYMENT_FAILS",
                    orderId: data.orderNo || data.orderId,
                  }),
                );
              }
            } catch (error) {}
          }
        });
      },

      // onStompError: (frame) => {
      //   console.error("STOMP Error พบข้อผิดพลาด:", frame.headers["message"]);
      // },

      // onWebSocketError: (event) => {
      //   console.error("WebSocket Error:", event);
      // },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
      // console.log("ปิดการเชื่อมต่อ WebSocket แล้ว");
    };
  }, [dispatch, token]);
};

export default usePaymentSocket;

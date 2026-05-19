import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";
import { setPaymentStatus } from "../redux/payment/paymentReducer";
import type { RootState } from "../redux/store";

let globalClient: Client | null = null;

const usePaymentSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    console.log("SOCKET EFFECT RUN");

    if (!token) {
      console.log("WAITING TOKEN...");
      return;
    }

    // ✅ reuse connection
    if (globalClient) {
      console.log("REUSE SOCKET");
      return;
    }

    console.log("CONNECT SOCKET WITH TOKEN");

    const client = new Client({
      //https://api.store-mate-api.me/ws
      webSocketFactory: () => new SockJS(import.meta.env.VITE_SOCKET_URL),

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => console.log("[STOMP]", str),

      onConnect: () => {
        console.log("SOCKET CONNECTED");

        client.subscribe("/user/queue/notifications", (message) => {
          if (!message.body) return;

          const data = JSON.parse(message.body);
          const currentOrder = localStorage.getItem("orderNo");

          if (data.orderNo && data.orderNo !== currentOrder) return;

          if (
            data.paymentStatus === "PAYMENT_SUCCESS" ||
            data.status === "COMPLETED"
          ) {
            toast.dismiss();
            toast.success("ชำระเงินสำเร็จ");

            localStorage.removeItem("orderNo");

            dispatch(
              setPaymentStatus({
                status: "PAYMENT_SUCCESS",
                orderId: data.orderNo || data.orderId,
              }),
            );
          }
          console.log("WS DATA:", data);

          if (
            data.paymentStatus === "PAYMENT_FAILS" ||
            data.status === "CANCELLED"
          ) {
            toast.error("ชำระเงินไม่สำเร็จ");

            dispatch(
              setPaymentStatus({
                status: "PAYMENT_FAILS",
                orderId: data.orderNo || data.orderId,
              }),
            );
          }
        });
      },

      onWebSocketClose: () => {
        console.log("SOCKET CLOSED");
        globalClient = null;
      },

      onStompError: (frame) => {
        console.error("STOMP ERROR:", frame.headers["message"]);
      },
    });

    globalClient = client;
    client.activate();

    // ❌ ไม่ต้อง deactivate ทุกครั้ง
    return () => {
      console.log("EFFECT CLEANUP (NO DISCONNECT)");
    };
  }, [token, dispatch]);
};

export default usePaymentSocket;

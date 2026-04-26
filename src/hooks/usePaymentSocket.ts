import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";
import { setPaymentStatus } from "../redux/payment/paymentReducer";
import { getAccessToken } from "../utils/auth";

let globalClient: Client | null = null;

const usePaymentSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🚀 SOCKET INIT START");

    const token = getAccessToken();

    console.log("🔑 TOKEN:", token);

    if (!token) {
      console.log("⛔ NO TOKEN → SKIP SOCKET");
      return;
    }

    // กัน duplicate connection
    if (globalClient?.active) {
      console.log("⚠️ SOCKET ALREADY ACTIVE");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_SOCKET_URL),

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // 🔥 IMPORTANT: send identity
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => console.log("[STOMP]", str),

      onConnect: () => {
        console.log("✅ SOCKET CONNECTED");

        client.subscribe("/user/queue/notifications", (message) => {
          if (!message.body) return;

          const data = JSON.parse(message.body);
          const currentOrder = localStorage.getItem("orderNo");

          if (data.orderNo && data.orderNo !== currentOrder) return;

          // ✅ SUCCESS
          if (
            data.paymentStatus === "PAYMENT_SUCCESS" ||
            data.status === "COMPLETED"
          ) {
            toast.success("ชำระเงินสำเร็จ 🎉");

            localStorage.removeItem("orderNo");

            dispatch(
              setPaymentStatus({
                status: "PAYMENT_SUCCESS",
                orderId: data.orderNo || data.orderId,
              }),
            );
          }

          // ❌ FAIL
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
        console.log("🔴 SOCKET CLOSED");
      },

      onStompError: (frame) => {
        console.error("STOMP ERROR:", frame.headers["message"]);
      },
    });

    globalClient = client;
    client.activate();

    return () => {
      console.log("🧹 CLEANUP SOCKET");

      client.deactivate();
      globalClient = null;
    };
  }, [dispatch]);
};

export default usePaymentSocket;

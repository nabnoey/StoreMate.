import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-hot-toast";

import type { RootState, AppDispatch } from "../redux/store";
import { addNotificationFromSocket } from "../redux/notification/notificationReducer";

let globalNotifyClient: Client | null = null;
let currentNotifyToken: string | null = null;

const useNotificationSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.roleName); // สมมติว่าคืนกลับมาเป็น OWNER, MODERATOR, USER

  useEffect(() => {
    // แก้ไขบั๊ก Logout: ถ้าไม่มี Token แต่มี Client ค้างอยู่ ให้สั่งปิดทันที!
    if (!token || !userRole) {
      if (globalNotifyClient) {
        console.log("[NOTIFY STOMP] Disconnecting due to logout...");
        globalNotifyClient.deactivate();
        globalNotifyClient = null;
        currentNotifyToken = null;
      }
      return;
    }

    // ถ้า Token เดิมยังเหมือนเดิม ไม่ต้องทำอะไรซ้ำ
    if (globalNotifyClient && currentNotifyToken === token) {
      return;
    }

    // ถ้าเปลี่ยน User (Token เปลี่ยน) ให้ปิดตัวเก่าก่อนสร้างตัวใหม่
    if (globalNotifyClient && currentNotifyToken !== token) {
      globalNotifyClient.deactivate();
      globalNotifyClient = null;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_SOCKET_URL, null),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[NOTIFY STOMP]", str),

      onConnect: () => {
        console.log("NOTIFY SOCKET CONNECTED");

        const handleIncomingNotification = (message: any) => {
          if (!message.body) return;
          const data = JSON.parse(message.body);

          toast.success(`ประกาศใหม่: ${data.title}`, { duration: 5000 });
          dispatch(addNotificationFromSocket(data));
        };

        client.subscribe("/topic/all", handleIncomingNotification);

        // แยกเส้นตามกลุ่มเป้าหมาย (Recipients) ใน Use Case
        if (userRole === "USER") {
          client.subscribe("/topic/customer", handleIncomingNotification);
        } else if (userRole === "MODERATOR") {
          client.subscribe("/topic/moderator", handleIncomingNotification);
        } else if (userRole === "ADMIN") {
          client.subscribe("/topic/owner", handleIncomingNotification);
        }
      },
      onWebSocketClose: () => {
        console.log("NOTIFY SOCKET CLOSED");
        globalNotifyClient = null;
        currentNotifyToken = null;
      },
      onStompError: (frame) => {
        console.error("NOTIFY STOMP ERROR:", frame.headers["message"]);
      },
    });

    globalNotifyClient = client;
    currentNotifyToken = token;
    client.activate();

    return () => {};
  }, [token, userRole, dispatch]);
};

export default useNotificationSocket;

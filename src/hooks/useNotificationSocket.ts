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
  const userRole = useSelector((state: RootState) => state.auth.user?.roleName); // USER, MODERATOR, OWNER/ADMIN

  useEffect(() => {
    // 🚪 จัดการกรณี Logout หรือสิทธิ์หลุด
    if (!token || !userRole) {
      if (globalNotifyClient) {
        console.log("[NOTIFY STOMP] Disconnecting due to logout...");
        globalNotifyClient.deactivate();
        globalNotifyClient = null;
        currentNotifyToken = null;
      }
      return;
    }

    // ป้องกันการสร้าง Connection ซ้ำถ้า Token เดิมยังไม่เปลี่ยน
    if (globalNotifyClient && currentNotifyToken === token) {
      return;
    }

    // เคลียร์อันเก่าทิ้งซะถ้ามีการเปลี่ยนบัญชีผู้ใช้ในหน้าต่างเดิม
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

          // แสดงแจ้งเตือน Popup แบบ Realtime ด้วย React Hot Toast
          toast.success(`ประกาศใหม่: ${data.title}`, { duration: 5000 });

          // อัปเดตข้อมูลเข้า Redux Store ทันทีเพื่อให้ List Table อัปเดตข้อมูลปัจจุบัน (Postcondition UC-42)
          dispatch(addNotificationFromSocket(data));
        };

        // 🌐 ทุกคน (ทุก Role) ต้องรับข่าวสารจากช่องทางส่วนกลางเสมอ
        client.subscribe("/topic/all", handleIncomingNotification);

        // 🔐 แยกเส้นตรวจจับตามโครงสร้าง Role และสิทธิ์ตาม Requirement
        if (userRole === "USER") {
          client.subscribe("/topic/customer", handleIncomingNotification);
        } else if (userRole === "MODERATOR") {
          client.subscribe("/topic/moderator", handleIncomingNotification);
        } else {
          // ส่วนที่เหลือ (เช่น OWNER หรือ ADMIN) ให้จับเส้นแอดมินกลาง
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

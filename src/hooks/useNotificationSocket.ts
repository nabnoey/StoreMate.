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
  const userRole = useSelector((state: RootState) => state.auth.user?.roleName);

  useEffect(() => {
    if (!token || !userRole) return;

    if (globalNotifyClient && currentNotifyToken === token) {
      return;
    }

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
          //อันนี้กันยิงซ้ำ
          dispatch(addNotificationFromSocket(data));
        };

        // Subscription จัดการตาม Role
        client.subscribe("/topic/all", handleIncomingNotification);

        if (userRole === "USER") {
          client.subscribe("/topic/customer", handleIncomingNotification);
        } else if (userRole === "MODERATOR") {
          client.subscribe("/topic/moderator", handleIncomingNotification);
        } else {
          console.log("Admin connected to notification socket.");
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

/*
  useSensor.js
  Custom React hook untuk:
  1. Connect ke backend via Socket.io (WebSocket)
  2. Menerima update sensor realtime
  3. Fetch data historis via REST API
*/

import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export function useSensor(deviceId = "plantwatch-nano-001") {
  const [latest, setLatest] = useState(null);         // data sensor terbaru
  const [history, setHistory] = useState([]);          // array data 24 jam
  const [connected, setConnected] = useState(false);   // status WebSocket
  const [mqttStatus, setMqttStatus] = useState(null);  // status device IoT
  const [lastUpdate, setLastUpdate] = useState(null);  // kapan terakhir update

  const socketRef = useRef(null);

  // Fetch historis dari REST API
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/history?device_id=${deviceId}&hours=24`
      );
      const json = await res.json();
      if (json.ok && json.data.length > 0) {
        setHistory(json.data);
      }
    } catch (err) {
      console.error("[useSensor] Gagal fetch history:", err);
    }
  }, [deviceId]);

  useEffect(() => {
    // Ambil data historis saat pertama load
    fetchHistory();

    // Connect ke Socket.io
    const socket = io(BACKEND_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Terhubung ke backend");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Terputus dari backend");
      setConnected(false);
    });

    // Terima data sensor terbaru saat pertama connect
    socket.on("sensor:latest", (data) => {
      console.log("[Socket] Data awal:", data);
      setLatest(data);
      setLastUpdate(new Date());
    });

    // Terima update realtime tiap kali Arduino kirim data
    socket.on("sensor:update", (data) => {
      console.log("[Socket] Update sensor:", data);
      setLatest(data);
      setLastUpdate(new Date());

      // Tambahkan ke array historis
      setHistory((prev) => {
        const updated = [...prev, data];
        // Batasi history di memory: simpan max 1440 data points (24 jam x 1/menit)
        return updated.slice(-1440);
      });
    });

    // Status device (online/offline)
    socket.on("device:status", (data) => {
      console.log("[Socket] Status device:", data);
      setMqttStatus(data);
    });

    // Cleanup saat component unmount
    return () => {
      socket.disconnect();
    };
  }, [deviceId, fetchHistory]);

  // Format data historis untuk grafik Recharts
  const chartData = history.map((row) => ({
    time: new Date(row.recorded_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    soil: row.soil_pct,
    timestamp: row.recorded_at,
  }));

  return {
    latest,
    chartData,
    connected,
    mqttStatus,
    lastUpdate,
    refresh: fetchHistory,
  };
}

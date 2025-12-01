package com.spectramonitor.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spectramonitor.model.Device;
import com.spectramonitor.model.LogEntry;
import com.spectramonitor.repository.DeviceRepository;
import com.spectramonitor.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalHandler extends TextWebSocketHandler {

    private final DeviceRepository deviceRepository;
    private final LogRepository logRepository;
    private final ObjectMapper objectMapper;
    private final Map<String, Set<WebSocketSession>> sessionsByRoom = new ConcurrentHashMap<>();

    @Autowired
    public SignalHandler(DeviceRepository deviceRepository, LogRepository logRepository) {
        this.deviceRepository = deviceRepository;
        this.logRepository = logRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket client connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocket client disconnected: " + session.getId());
        sessionsByRoom.values().forEach(sessions -> sessions.remove(session));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> data = objectMapper.readValue(message.getPayload(), Map.class);
            String event = (String) data.get("event");
            Map<String, Object> payload = (Map<String, Object>) data.get("data");

            switch (event) {
                case "join_device_session":
                    handleJoinDeviceSession(session, (String) payload.get("deviceId"));
                    break;
                case "device:connect":
                    handleDeviceConnect(session, payload);
                    break;
                case "device:log":
                    handleDeviceLog(session, payload);
                    break;
                case "device:screen_frame":
                    handleScreenFrame(session, payload);
                    break;
            }
        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
        }
    }

    private void handleJoinDeviceSession(WebSocketSession session, String deviceId) {
        String room = "session:" + deviceId;
        sessionsByRoom.computeIfAbsent(room, k -> ConcurrentHashMap.newKeySet()).add(session);
        System.out.println("Client " + session.getId() + " joined " + room);
    }

    private void handleDeviceConnect(WebSocketSession session, Map<String, Object> deviceData) {
        String deviceId = (String) deviceData.get("id");
        
        deviceRepository.findByDeviceIdEquals(deviceId).ifPresentOrElse(
            device -> {
                device.setStatus("online");
                device.setLastSeen(new Date());
                deviceRepository.save(device);
            },
            () -> {
                Device device = new Device();
                device.setDeviceId(deviceId);
                device.setAppId((String) deviceData.get("appId"));
                device.setModel((String) deviceData.get("model"));
                device.setOsVersion((String) deviceData.get("osVersion"));
                device.setUserName((String) deviceData.get("userName"));
                device.setStatus("online");
                device.setLastSeen(new Date());
                deviceRepository.save(device);
            }
        );
        
        broadcastToAll("device:update", 
            Map.of("id", deviceId, "status", "online"));
    }

    private void handleDeviceLog(WebSocketSession session, Map<String, Object> logData) {
        LogEntry log = new LogEntry();
        log.setDeviceId((String) logData.get("deviceId"));
        log.setLevel((String) logData.get("level"));
        log.setMessage((String) logData.get("message"));
        log.setTag((String) logData.get("tag"));
        log.setTimestamp((String) logData.get("timestamp"));
        
        String level = log.getLevel();
        String message = log.getMessage();
        log.setIsAnomaly("error".equals(level) || (message != null && message.contains("Exception")));
        log.setCreatedAt(new Date());
        
        LogEntry savedLog = logRepository.save(log);
        
        broadcastToRoom("session:" + log.getDeviceId(), "log:new", savedLog);
    }

    private void handleScreenFrame(WebSocketSession session, Map<String, Object> data) {
        String deviceId = (String) data.get("deviceId");
        String imageBase64 = (String) data.get("imageBase64");
        
        broadcastToRoom("session:" + deviceId, "screen:frame", imageBase64);
    }

    private void broadcastToRoom(String room, String event, Object data) {
        Set<WebSocketSession> sessions = sessionsByRoom.get(room);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        Map<String, Object> message = Map.of("event", event, "data", data);
                        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
                    } catch (IOException e) {
                        System.err.println("Error sending message: " + e.getMessage());
                    }
                }
            }
        }
    }

    private void broadcastToAll(String event, Object data) {
        sessionsByRoom.values().forEach(sessions -> {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        Map<String, Object> message = Map.of("event", event, "data", data);
                        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
                    } catch (IOException e) {
                        System.err.println("Error sending message: " + e.getMessage());
                    }
                }
            }
        });
    }
}

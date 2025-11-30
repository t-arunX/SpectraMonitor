package com.spectramonitor.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.SocketIOClient;
import com.spectramonitor.model.Device;
import com.spectramonitor.model.LogEntry;
import com.spectramonitor.repository.DeviceRepository;
import com.spectramonitor.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;
import java.util.Date;
import java.util.Map;

@Component
public class SignalHandler implements CommandLineRunner {

    private final SocketIOServer server;
    private final DeviceRepository deviceRepository;
    private final LogRepository logRepository;

    @Autowired
    public SignalHandler(SocketIOServer server, DeviceRepository deviceRepository, LogRepository logRepository) {
        this.server = server;
        this.deviceRepository = deviceRepository;
        this.logRepository = logRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
        });

        server.addEventListener("join_device_session", String.class, (client, deviceId, ackRequest) -> {
            client.joinRoom("session:" + deviceId);
            System.out.println("Client " + client.getSessionId() + " joined session:" + deviceId);
        });

        server.addEventListener("device:connect", Map.class, (client, deviceData, ackRequest) -> {
            String deviceId = (String) deviceData.get("id");
            
            deviceRepository.findByIdEquals(deviceId).ifPresentOrElse(
                device -> {
                    device.setStatus("online");
                    device.setLastSeen(new Date());
                    deviceRepository.save(device);
                },
                () -> {
                    Device device = new Device();
                    device.setId(deviceId);
                    device.setAppId((String) deviceData.get("appId"));
                    device.setModel((String) deviceData.get("model"));
                    device.setOsVersion((String) deviceData.get("osVersion"));
                    device.setUserName((String) deviceData.get("userName"));
                    device.setStatus("online");
                    device.setLastSeen(new Date());
                    deviceRepository.save(device);
                }
            );
            
            server.getBroadcastOperations().sendEvent("device:update", 
                Map.of("id", deviceId, "status", "online"));
        });

        server.addEventListener("device:log", Map.class, (client, logData, ackRequest) -> {
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
            
            server.getRoomOperations("session:" + log.getDeviceId())
                  .sendEvent("log:new", savedLog);
        });

        server.addEventListener("device:screen_frame", Map.class, (client, data, ackRequest) -> {
            String deviceId = (String) data.get("deviceId");
            String imageBase64 = (String) data.get("imageBase64");
            
            server.getRoomOperations("session:" + deviceId)
                  .sendEvent("screen:frame", imageBase64);
        });

        server.start();
        System.out.println("Socket.IO server started on port " + server.getConfiguration().getPort());
    }

    @PreDestroy
    public void onShutdown() {
        if (server != null) {
            server.stop();
        }
    }

    public SocketIOServer getServer() {
        return server;
    }
}

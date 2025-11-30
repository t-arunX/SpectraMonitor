package com.spectramonitor.socket;

import com.spectramonitor.model.Device;
import com.spectramonitor.model.LogEntry;
import com.spectramonitor.repository.DeviceRepository;
import com.spectramonitor.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.Map;

@Controller
public class SignalHandler {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private LogRepository logRepository;

    @MessageMapping("/join_device_session")
    public void joinDeviceSession(@Payload String deviceId) {
        System.out.println("Client joined session for device: " + deviceId);
    }

    @MessageMapping("/device/connect")
    public void deviceConnect(@Payload Map<String, Object> deviceData) {
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
        
        messagingTemplate.convertAndSend("/topic/device/update", 
            Map.of("id", deviceId, "status", "online"));
    }

    @MessageMapping("/device/log")
    public void deviceLog(@Payload Map<String, Object> logData) {
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
        
        messagingTemplate.convertAndSend("/topic/session/" + log.getDeviceId() + "/log", savedLog);
    }

    @MessageMapping("/device/screen_frame")
    public void screenFrame(@Payload Map<String, Object> data) {
        String deviceId = (String) data.get("deviceId");
        String imageBase64 = (String) data.get("imageBase64");
        
        messagingTemplate.convertAndSend("/topic/session/" + deviceId + "/screen", imageBase64);
    }
}

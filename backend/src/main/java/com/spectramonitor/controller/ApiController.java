package com.spectramonitor.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.spectramonitor.model.*;
import com.spectramonitor.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private AppRepository appRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private FeatureFlagRepository featureFlagRepository;

    @Autowired
    private CrashReportRepository crashReportRepository;

    @Autowired
    private SocketIOServer socketIOServer;

    @GetMapping("/apps")
    public List<App> getApps() {
        return appRepository.findAll();
    }

    @PostMapping("/apps")
    public ResponseEntity<App> createApp(@RequestBody Map<String, Object> body) {
        App app = new App();
        app.setId("app_" + System.currentTimeMillis());
        app.setName((String) body.get("name"));
        app.setPlatform((String) body.get("platform"));
        app.setDescription((String) body.get("description"));
        app.setIcon((String) body.get("icon"));
        app.setApiKey("sk_live_" + UUID.randomUUID().toString().replace("-", "").substring(0, 24));
        app.setCreatedAt(new Date());
        
        App savedApp = appRepository.save(app);
        return ResponseEntity.status(201).body(savedApp);
    }

    @GetMapping("/apps/{appId}/devices")
    public List<Device> getDevices(@PathVariable String appId) {
        return deviceRepository.findByAppId(appId);
    }

    @PostMapping("/apps/{appId}/devices")
    public ResponseEntity<Device> createDevice(@PathVariable String appId, @RequestBody Map<String, Object> body) {
        Device device = new Device();
        device.setId((String) body.getOrDefault("id", "device_" + System.currentTimeMillis()));
        device.setAppId(appId);
        device.setModel((String) body.getOrDefault("model", "Unknown"));
        device.setOsVersion((String) body.getOrDefault("osVersion", "Unknown"));
        device.setUserName((String) body.getOrDefault("userName", "Test User"));
        device.setStatus((String) body.getOrDefault("status", "online"));
        device.setLastSeen(new Date());
        
        Device savedDevice = deviceRepository.save(device);
        socketIOServer.getBroadcastOperations().sendEvent("device:update", 
            Map.of("id", device.getId(), "status", "online"));
        return ResponseEntity.status(201).body(savedDevice);
    }

    @GetMapping("/devices/{deviceId}")
    public ResponseEntity<Device> getDevice(@PathVariable String deviceId) {
        return deviceRepository.findByIdEquals(deviceId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/devices/{deviceId}/logs")
    public List<LogEntry> getLogs(@PathVariable String deviceId,
                                   @RequestParam(defaultValue = "100") int limit) {
        List<LogEntry> logs = logRepository.findByDeviceIdOrderByCreatedAtDesc(
                deviceId, 
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        Collections.reverse(logs);
        return logs;
    }

    @GetMapping("/flags")
    public List<FeatureFlag> getFlags() {
        return featureFlagRepository.findAll();
    }

    @PostMapping("/flags")
    public FeatureFlag createFlag(@RequestBody FeatureFlag flag) {
        FeatureFlag savedFlag = featureFlagRepository.save(flag);
        socketIOServer.getBroadcastOperations().sendEvent("flag:updated", savedFlag);
        return savedFlag;
    }

    @PutMapping("/flags/{id}")
    public ResponseEntity<FeatureFlag> updateFlag(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return featureFlagRepository.findByIdEquals(id)
                .map(flag -> {
                    if (body.containsKey("enabled")) {
                        flag.setEnabled((Boolean) body.get("enabled"));
                    }
                    if (body.containsKey("rolloutPercentage")) {
                        flag.setRolloutPercentage((Integer) body.get("rolloutPercentage"));
                    }
                    if (body.containsKey("name")) {
                        flag.setName((String) body.get("name"));
                    }
                    if (body.containsKey("description")) {
                        flag.setDescription((String) body.get("description"));
                    }
                    FeatureFlag updated = featureFlagRepository.save(flag);
                    socketIOServer.getBroadcastOperations().sendEvent("flag:updated", updated);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

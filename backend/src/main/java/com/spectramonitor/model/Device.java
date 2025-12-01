package com.spectramonitor.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Getter
@Setter
@Document(collection = "devices")
public class Device {
    @Id
    private String mongoId;
    private String deviceId;
    private String appId;
    private String model;
    private String osVersion;
    private Integer batteryLevel;
    private String userName;
    private String status;
    private String ip;
    private String sessionDuration;
    private DeviceHealth health;
    private Date lastSeen;

    public Device() {
        this.lastSeen = new Date();
    }

    @Getter
    @Setter
    public static class DeviceHealth {
        private Integer score;
        private Integer uxScore;
        private Integer performanceIndex;
        private Integer crashFreeSessions;
        private String churnRisk;
    }
}

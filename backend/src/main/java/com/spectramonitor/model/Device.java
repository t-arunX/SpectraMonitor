package com.spectramonitor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "devices")
public class Device {
    @Id
    private String mongoId;
    private String id;
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

    public static class DeviceHealth {
        private Integer score;
        private Integer uxScore;
        private Integer performanceIndex;
        private Integer crashFreeSessions;
        private String churnRisk;

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }

        public Integer getUxScore() { return uxScore; }
        public void setUxScore(Integer uxScore) { this.uxScore = uxScore; }

        public Integer getPerformanceIndex() { return performanceIndex; }
        public void setPerformanceIndex(Integer performanceIndex) { this.performanceIndex = performanceIndex; }

        public Integer getCrashFreeSessions() { return crashFreeSessions; }
        public void setCrashFreeSessions(Integer crashFreeSessions) { this.crashFreeSessions = crashFreeSessions; }

        public String getChurnRisk() { return churnRisk; }
        public void setChurnRisk(String churnRisk) { this.churnRisk = churnRisk; }
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getSessionDuration() { return sessionDuration; }
    public void setSessionDuration(String sessionDuration) { this.sessionDuration = sessionDuration; }

    public DeviceHealth getHealth() { return health; }
    public void setHealth(DeviceHealth health) { this.health = health; }

    public Date getLastSeen() { return lastSeen; }
    public void setLastSeen(Date lastSeen) { this.lastSeen = lastSeen; }
}

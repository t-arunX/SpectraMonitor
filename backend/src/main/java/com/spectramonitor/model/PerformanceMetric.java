package com.spectramonitor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "performance_metrics")
public class PerformanceMetric {
    @Id
    private String mongoId;
    private String deviceId;
    private Double cpuUsage;
    private Double memoryUsage;
    private Double batteryLevel;
    private Integer temperature;
    private Long fps;
    private Long uploadSpeed;
    private Long downloadSpeed;
    private Date timestamp;

    public PerformanceMetric() {
        this.timestamp = new Date();
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public Double getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(Double cpuUsage) { this.cpuUsage = cpuUsage; }

    public Double getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(Double memoryUsage) { this.memoryUsage = memoryUsage; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }

    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }

    public Long getFps() { return fps; }
    public void setFps(Long fps) { this.fps = fps; }

    public Long getUploadSpeed() { return uploadSpeed; }
    public void setUploadSpeed(Long uploadSpeed) { this.uploadSpeed = uploadSpeed; }

    public Long getDownloadSpeed() { return downloadSpeed; }
    public void setDownloadSpeed(Long downloadSpeed) { this.downloadSpeed = downloadSpeed; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}

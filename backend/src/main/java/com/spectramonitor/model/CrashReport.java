package com.spectramonitor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "crashreports")
public class CrashReport {
    @Id
    private String mongoId;
    private String id;
    private String appId;
    private String timestamp;
    private String type;
    private String title;
    private String subtitle;
    private String error;
    private String stackTrace;
    private String affectedFile;
    private Integer eventsCount;
    private Integer usersCount;
    private List<Integer> trend;

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getStackTrace() { return stackTrace; }
    public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }

    public String getAffectedFile() { return affectedFile; }
    public void setAffectedFile(String affectedFile) { this.affectedFile = affectedFile; }

    public Integer getEventsCount() { return eventsCount; }
    public void setEventsCount(Integer eventsCount) { this.eventsCount = eventsCount; }

    public Integer getUsersCount() { return usersCount; }
    public void setUsersCount(Integer usersCount) { this.usersCount = usersCount; }

    public List<Integer> getTrend() { return trend; }
    public void setTrend(List<Integer> trend) { this.trend = trend; }
}

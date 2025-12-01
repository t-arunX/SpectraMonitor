package com.spectramonitor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "network_requests")
public class NetworkRequest {
    @Id
    private String mongoId;
    private String deviceId;
    private String method;
    private String url;
    private Integer statusCode;
    private Long duration;
    private Long requestSize;
    private Long responseSize;
    private String error;
    private Date timestamp;

    public NetworkRequest() {
        this.timestamp = new Date();
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }

    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }

    public Long getRequestSize() { return requestSize; }
    public void setRequestSize(Long requestSize) { this.requestSize = requestSize; }

    public Long getResponseSize() { return responseSize; }
    public void setResponseSize(Long responseSize) { this.responseSize = responseSize; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}

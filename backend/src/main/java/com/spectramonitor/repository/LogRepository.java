package com.spectramonitor.repository;

import com.spectramonitor.model.LogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface LogRepository extends MongoRepository<LogEntry, String> {
    List<LogEntry> findByDeviceIdOrderByCreatedAtDesc(String deviceId, Pageable pageable);
}

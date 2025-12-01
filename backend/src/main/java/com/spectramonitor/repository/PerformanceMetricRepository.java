package com.spectramonitor.repository;

import com.spectramonitor.model.PerformanceMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface PerformanceMetricRepository extends MongoRepository<PerformanceMetric, String> {
    List<PerformanceMetric> findByDeviceIdOrderByTimestampDesc(String deviceId, Pageable pageable);
}

package com.spectramonitor.repository;

import com.spectramonitor.model.NetworkRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface NetworkRequestRepository extends MongoRepository<NetworkRequest, String> {
    List<NetworkRequest> findByDeviceIdOrderByTimestampDesc(String deviceId, Pageable pageable);
}

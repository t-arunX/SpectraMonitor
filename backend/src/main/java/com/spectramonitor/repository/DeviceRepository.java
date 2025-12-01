package com.spectramonitor.repository;

import com.spectramonitor.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends MongoRepository<Device, String> {
    List<Device> findByAppId(String appId);
    Optional<Device> findByIdEquals(String id);
    void deleteByAppId(String appId);
}

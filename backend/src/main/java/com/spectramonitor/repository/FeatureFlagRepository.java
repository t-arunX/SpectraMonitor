package com.spectramonitor.repository;

import com.spectramonitor.model.FeatureFlag;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FeatureFlagRepository extends MongoRepository<FeatureFlag, String> {
    Optional<FeatureFlag> findByIdEquals(String id);
}

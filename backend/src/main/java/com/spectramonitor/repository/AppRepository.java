package com.spectramonitor.repository;

import com.spectramonitor.model.App;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AppRepository extends MongoRepository<App, String> {
    Optional<App> findByIdEquals(String id);
}

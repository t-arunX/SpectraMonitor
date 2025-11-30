package com.spectramonitor.repository;

import com.spectramonitor.model.CrashReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CrashReportRepository extends MongoRepository<CrashReport, String> {
    List<CrashReport> findByAppId(String appId);
    Optional<CrashReport> findByIdEquals(String id);
}

package com.spectramonitor.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;

import static java.lang.System.out;

@Component
public class ApiAuditInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        request.setAttribute("startTime", Instant.now().toEpochMilli());
        return true; // continue request
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

        long start = (long) request.getAttribute("startTime");
        long duration = Instant.now().toEpochMilli() - start;

        String log = String.format(
                "API CALL -> Method: %s, Path: %s, Status: %d, IP: %s, Duration: %dms",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                request.getRemoteAddr(),
                duration
        );

        out.println(log);
//        out.println(request.startAsync().getResponse());
    }
}

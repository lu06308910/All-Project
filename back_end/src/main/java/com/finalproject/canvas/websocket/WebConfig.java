package com.finalproject.canvas.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 시스템 환경변수를 활용하여 경로를 OS에 맡김
        String uploadPath = "file:///C:/upload/";

        // 2. 경로를 더 명확하게 매핑
        registry.addResourceHandler("/upload/**")
                .addResourceLocations(uploadPath)
                .setCachePeriod(0); // 캐시를 0으로 해서 즉시 반영되게 함
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

}

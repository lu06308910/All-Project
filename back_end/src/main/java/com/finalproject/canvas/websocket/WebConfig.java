package com.finalproject.canvas.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1) C:/upload/ 전체 접근
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:/C:/upload/");

        // 2) C:/upload/review/ 개별 접근
        registry.addResourceHandler("/upload/review/**")
                .addResourceLocations("file:/C:/upload/review/");
    }
}

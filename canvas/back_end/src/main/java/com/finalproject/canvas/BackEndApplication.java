package com.finalproject.canvas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class BackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackEndApplication.class, args);
	}

    // 대호추가 - 카카오페이 결제
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}

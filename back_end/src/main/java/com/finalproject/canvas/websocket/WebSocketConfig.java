package com.finalproject.canvas.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // 웹소켓 메시지 핸들링을 활성화합니다.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 1. 클라이언트(리액트)가 처음 연결을 시도할 때 사용할 주소
        registry.addEndpoint("/ws-canvas")
                .setAllowedOriginPatterns("http://192.168.4.51:9989") // 리액트 주소 허용
                .withSockJS(); // 낮은 버전의 브라우저도 지원하도록 SockJS 설정
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 2. 서버가 클라이언트에게 메시지를 보낼 때 (구독 경로)
        // 리액트에서 이 경로를 '구독'하고 있으면 서버가 보내는 데이터를 즉시 받습니다.
        registry.enableSimpleBroker("/topic");

        // 3. 클라이언트가 서버로 메시지를 보낼 때 (발신 경로)
        // 리액트에서 메시지를 보낼 때 앞에 붙이는 접두어입니다.
        registry.setApplicationDestinationPrefixes("/app");
    }


}

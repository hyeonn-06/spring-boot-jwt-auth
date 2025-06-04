package com.helper.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
public class WebConfig  implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry resistry) {
		
//		log.info("크로스 서버 설정 .........");
//		
//		// resistry에 매핑 등록
//		resistry.addMapping("/**") // 접근 url
//		.allowedOrigins("http://localhost:3000") // 접근할 수 있는 서버
//		.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 접근 방법
//		.allowedHeaders("*") // 허용할 header 지정
//		.allowCredentials(true);
	}
}

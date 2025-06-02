package com.helper.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.helper.auth.filter.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity // 웹 보안 활성화
public class SecurityConfig {
	
	@Autowired
	private JwtAuthenticationFilter jwtAuthFilter;
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
	    // 1. CSRF 보호 비활성화 (JWT는 Stateless이므로 일반적으로 REST API에서 필요 없음)
	    .csrf(csrf -> csrf.disable())
	    // 2. HTTP Basic 인증 비활성화 (브라우저 기본 인증 팝업 방지)
	    .httpBasic(httpBasic -> httpBasic.disable())
	    // 3. 폼 로그인 비활성화 (⭐ localhost/login 리다이렉션을 막는 핵심 설정 ⭐)
	    .formLogin(formLogin -> formLogin.disable())
	    // 4. 세션 사용 안 함 (JWT는 서버에 상태를 저장하지 않는 Stateless 방식)
	    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	    // 5. 헤더 관련 설정 (H2 Console 등)
	    // H2-Console이 iframe 내에서 작동하려면 X-Frame-Options를 비활성화해야 합니다.
	    .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))       
	    // 6. 요청별 접근 권한 설정
	    .authorizeHttpRequests(authorize -> authorize
		// ⭐ 인증 없이 접근 허용할 경로들 (로그인, 회원가입 등 공개 API) ⭐
        // H2 콘솔 접근 설정 (개발용), Favicon, 기본 에러 페이지도 permitAll()
        .requestMatchers("/auth/**", "/user/**", "/h2-console/**", "/favicon.ico", "/error").permitAll()    
        // Swagger UI 관련 경로도 개발 시 permitAll() 하는 경우가 많습니다.
        // .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-resources/**", "/webjars/**").permitAll()                
        // ⭐ ADMIN은 USER 권한이 필요한 경로에도 접근 가능하도록 명시적으로 추가 ⭐
        // "user/**" 경로는 "ROLE_USER" 또는 "ROLE_ADMIN" 권한을 가진 사용자만 접근 가능
        .requestMatchers("/member/**").hasAnyRole("MEMBER", "ADMIN") 
        // .hasAnyRole()을 사용하여 여러 역할을 지정합니다.                
        // "admin/**" 경로는 오직 "ROLE_ADMIN" 권한을 가진 사용자만 접근 가능
	    .requestMatchers("/admin/**").hasRole("ADMIN")
	    )
	    
	    // 7. JWT 인증 필터 추가
	    // Spring Security 필터 체인 중 BasicAuthenticationFilter 이전에
	    // 우리가 만든 JwtAuthenticationFilter가 실행되도록 설정합니다.
	    .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class);

		// 8. 예외 처리 (선택 사항이지만, REST API에서는 오류 응답을 명확히 하기 위해 권장)
		// .exceptionHandling(exceptionHandling -> exceptionHandling
		//     .authenticationEntryPoint(new CustomAuthenticationEntryPoint()) // 인증되지 않은 사용자가 보호된 리소스에 접근 시
		// 	   .accessDeniedHandler(new CustomAccessDeniedHandler())     // 인증된 사용자가 권한 없는 리소스에 접근 시
		// );

        return http.build();
	}
}

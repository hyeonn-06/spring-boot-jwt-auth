package com.helper.member.controller;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.helper.chatbot.vo.ChatBotVO;

import lombok.extern.log4j.Log4j2;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/member")
@Log4j2
public class MemberRestController {
	private final WebClient webClient;
	
	public MemberRestController(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("http://localhost:8000/ask").build();
	}
	
	@GetMapping("/getId.do")
	// @AuthenticationPrincipal : Spring Security의 SecurityContextHolder에 저장되어있는 현재 인증된 사용자 정보를 주입
	// 다수의 클라이언트가 로그인하더라도 userDetails 매개변수에는 항상 현재 요청을 보낸 특정 클라이언트의 인증 정보만 주입됨
	public String getId(@AuthenticationPrincipal UserDetails userDetails) {
		if (userDetails != null) {
            String userId = userDetails.getUsername(); // UserDetails의 getUsername()은 사용자 ID 반환
            // 권한 정보는 getAuthorities()로 가져올 수 있지만, 문자열로 깔끔하게 조합하려면
            // 스트림 API를 사용할 수 있습니다.
            String roles = userDetails.getAuthorities().stream()
                                  .map(GrantedAuthority::getAuthority) // GrantedAuthority는 인터페이스, 구현체는 SimpleGrantedAuthority
                                  .collect(Collectors.joining(", ")); // 쉼표로 구분된 문자열로 결합

            log.info("인증된 사용자 ID: {}, 권한: {}", userId, roles);
            return userId;
        } else {
            // @AuthenticationPrincipal이 null 이라는 것은 인증이 되지 않은 상태를 의미합니다.
            // SecurityConfig에서 해당 경로가 permitAll()로 설정되어 있다면 이곳으로 들어올 수 있습니다.
            log.info("인증되지 않은 사용자입니다.");
            return "";
        }
	}
	
	@PostMapping("/chatbot/ask.do")
	public Mono<ResponseEntity<ChatBotVO>> ask(@RequestBody ChatBotVO vo, @AuthenticationPrincipal UserDetails userDetails){
		log.info("----- MemberController ask() -----");
		if(userDetails != null)
			vo.setMember_id(userDetails.getUsername());
		else
			return null;
		return this.webClient.post()
				.body(Mono.just(vo), ChatBotVO.class) // ChatBotVO 객체를 요청 본문으로 설정
				.retrieve() // 응답을 검색
				.toEntity(ChatBotVO.class) // 응답 본문을 ChatBotVO 객체로 변환하여 ResponseEntity로 반환
				.doOnSuccess(responseEntity -> log.info("챗봇 응답 성공: {}", responseEntity.getBody()))
				.doOnError(error -> log.error("챗봇 응답 오류: {}", error.getMessage()));
	}

}

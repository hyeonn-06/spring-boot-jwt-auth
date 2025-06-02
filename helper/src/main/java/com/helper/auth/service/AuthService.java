package com.helper.auth.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helper.auth.mapper.AuthMapper;
import com.helper.auth.vo.AuthVO;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class AuthService {
	
	@Autowired
	private AuthMapper mapper;
	
	public Integer login(AuthVO vo) {
		log.info("----- LoginService login() -----");
		return mapper.login(vo);
	}
	
	public String getAuth(AuthVO vo) {
		log.info("----- LoginService getAuth() -----");
		return mapper.getAuth(vo);
	}
	
	public Integer insertRefreshToken(String member_id, String token, Date expiry_date) {
		log.info("----- LoginService insertRefreshToken() -----");
		return mapper.insertRefreshToken(member_id, token, expiry_date);
	}
	
	public Integer logout(AuthVO vo) {
		log.info("----- LoginService logout() -----");
		return mapper.logout(vo);
	}
}

# 🐾 CSPF - 반려동물 가구를 위한 종합 케어 서비스 (Back-end)

> 반려동물 보호자와 법률·보험·병원 전문가를 연결하는 상담 예약 및 실시간 채팅 플랫폼

<br>

## 🛠 기술 스택

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br>

## 📌 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2023.03.04 ~ 2023.11.14 |
| 개발 인원 | 4인 팀 프로젝트 |


<br>

## ✨ 주요 기능

- **상담 예약 관리** : 보험사·변호사 상담 및 동물병원 진료 예약/관리
- **실시간 채팅** : Socket.io 기반 클라이언트(APP)↔전문가(Web) 실시간 메시지 송수신 및 이미지 첨부
- **채팅 신고 관리** : 부적절한 채팅 신고 접수 및 관리자 처리
- **동물병원 위치 조회** : 사용자 위치 기반 근방 동물병원 구글 지도 연동
- **공식 판례 데이터 조회** : 외부 API 연계를 통한 법률 판례 검색
- **회원 관리** : 회원가입, 아이디/비밀번호 찾기, 유저 수정/삭제/블랙리스트 처리
- **전문가 자격 심사** : 전문가 회원가입 후 자격증 조회 및 관리자 승인 절차

<br>

## 🔥 트러블슈팅

### 1. 서버 간 데이터 전송 실패 (CORS)
**문제** : 다른 도메인/IP의 프론트엔드 서버와 백엔드 서버 간 데이터 교환 불가

**해결** : Front 및 Back-end 서버에 CORS 설정을 적용하여 다른 도메인 간 데이터 교환이 가능하도록 처리

---

### 2. WebSocket 데이터 교환 실패
**문제** : Socket.io를 통한 모바일 앱/웹 브라우저와 백엔드 서버 간 데이터 교환 불가

**해결** : 백엔드 서버에 웹소켓 게이트웨이 설정 및 CORS 옵션 credential 활성화. JWT 토큰으로 사용자 인증 후 웹/앱 서버에 socket.io/Okhttp Auth 헤더에 JWT Token 설정하여 해결

---

### 3. HTTPS 채팅 메시지 교환 실패
**문제** : HTTPS 프로토콜을 통한 모바일 앱과 웹 브라우저 간 메시지 교환 불가

**해결** : SSL 인증서 미발급으로 인한 데이터 수신 차단 상황으로, 차선책으로 HTTP 프로토콜을 통한 메시지 교환으로 전환하여 해결

<br>

## 📁 프론트엔드 Repository
- React (Web 관리자): [cspf-front-react](https://github.com/Zx5xd/cspf-front-react)

// src/components/NaverLoginButton.tsx
import React from 'react';

const NaverLoginButton: React.FC = () => {
    const NAVER_CLIENT_ID = 'bIJbfHfcyZpcgNsPOhll';
    const REDIRECT_URI = 'http://localhost:3500/auth/naver/callback'; // Vite dev server의 URL
    const STATE_STRING = 'RANDOM_STATE_STRING'; // CSRF 공격 방지를 위한 상태 값

    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE_STRING}`;

    return (
        <a href={naverLoginUrl} style={{ textDecoration: 'none' }}>
    <button
        style={{
        backgroundColor: '#03C75A',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
    }}
>
    네이버 로그인
    </button>
    </a>
);
};

export default NaverLoginButton;

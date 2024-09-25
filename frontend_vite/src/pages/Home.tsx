// src/pages/Home.tsx
import React from 'react';
import NaverLoginButton from '../components/NaverLoginButton';

const Home: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Welcome to My App</h1>
            <NaverLoginButton />
        </div>
    );
};

export default Home;

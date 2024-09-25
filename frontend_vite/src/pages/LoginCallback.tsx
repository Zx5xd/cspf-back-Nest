// src/pages/LoginCallback.tsx
import base64 from 'base-64';
import utf8 from 'utf8';
import React, {useEffect, useState} from 'react';
import { useSearchParams } from 'react-router-dom';

const LoginCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState({ name: '', email: '', mobile: '', nickname: '' });

    useEffect(() => {

        const token = searchParams.get('token');

        // @ts-ignore
        const payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
        const decodedPayload = base64.decode(payload);
        const jsonPayload = JSON.parse(utf8.decode(decodedPayload));
        console.log(JSON.stringify(jsonPayload));

        setUser(jsonPayload);



    }, [searchParams]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Login Callback</h1>
            <p>Name : {user.name}</p>
            <p>Email : {user.email}</p>
            <p>Mobile : {user.mobile}</p>
            <p>NickName : {user.nickname}</p>
        </div>
    );
};

export default LoginCallback;

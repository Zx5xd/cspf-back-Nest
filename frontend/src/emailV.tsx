import React, { useState } from 'react';
import axios from 'axios';

const Email: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGetRequest = async () => {
    setError('');
    setMessage('');

    try {
      // GET 요청을 보냅니다.
      const response = await axios.get('http://localhost:3500/auth/register');

      if (response.status === 200) {
        // 성공적인 응답을 받으면 메시지를 설정합니다.
        setMessage('이메일 난수코드 전송 성공!');
      } else {
        setError('요청이 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('Error during GET request:', err);
      setError('요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <h1>Email Registration</h1>
      <button onClick={handleGetRequest}>Send Request</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Email;

import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom'; // ChatRoom 컴포넌트를 import
import UserList from './components/UserList';

const VoiceChat: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // User ID 상태를 관리

  console.log("userId = " + userId); // 현재 User ID를 콘솔에 출력

  // 폼 제출 시 호출되는 함수
  const handleJoin = (event: React.FormEvent) => {
    console.log("handleJoin 작동"); // 함수가 호출될 때 콘솔에 출력
    event.preventDefault(); // 폼의 기본 제출 동작을 방지
    if (userId.trim() !== '') { // User ID가 입력되었는지 확인
      console.log(userId); // User ID를 콘솔에 출력
      // 이후 보이스챗 룸으로 이동하는 로직 추가 가능
    }
  };

  return (
    <div>
      <h1>Welcome to Voice Chat</h1>
      {userId ? (
        <ChatRoom userId={userId} /> /* User ID가 있으면 ChatRoom 컴포넌트를 렌더링 */
      ) : (
        <form onSubmit={handleJoin}> 
          <input
            type="text"
            placeholder="Enter your user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)} // 입력 값을 상태로 저장
          />
          <button type="submit">Join Chat</button> 
        </form>
      )}
    </div>
  );
}

export default VoiceChat;

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import UserList from './UserList';

const socket = io('http://localhost:3500'); // 백엔드 주소

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const ChatRoom: React.FC<{ userId: string }> = ({ userId }) => {
  const [users, setUsers] = useState<{ id: string }[]>([]);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  console.log("ChatRoom userId = " + userId);

  useEffect(() => {
    setUsers(prevUsers => [...prevUsers, { id: userId }]);

    socket.emit('joinRoom', { userId, room: 'voice_chat_room' });

    console.log("ChatRoom socketID = " + socket.id);

    // WebRTC 시그널링 처리
    const handleSignal = async (data: any) => {
      console.log('Received signal:', data); // 수신된 데이터를 로그로 출력하여 확인

      // 데이터 검증: signal 객체가 올바른지 확인
      if (data.signal && typeof data.signal === 'object' && data.signal.type && data.signal.sdp) {
        try {
          const remoteDescription = new RTCSessionDescription(data.signal);
          await peerConnection.current?.setRemoteDescription(remoteDescription);

          if (data.signal.type === 'offer') {
            console.log(`ChatRoom data signal type: ${data.signal.type}`);
            const answer = await peerConnection.current?.createAnswer();
            await peerConnection.current?.setLocalDescription(answer);
            socket.emit('signal', { signal: answer, room: 'voice_chat_room', from: socket.id });
          }
        } catch (error) {
          console.error('Failed to set remote description:', error);
        }
      } else if (data.signal && data.signal.candidate) {
        // ICE Candidate 수신 및 추가
        try {
          await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.signal));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      } else {
        console.error('Invalid signal data received:', data); // 데이터가 유효하지 않음
      }
    };

    // 시그널 이벤트 리스너 설정
    socket.on('signal', handleSignal);

    socket.on('updateUserList', (users) => {
      setUsers(users);
    });

    // 로컬 미디어 스트림 설정 및 WebRTC 연결 초기화
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      console.log("navigator getUserMedia 함수 진입");
      localStream.current = stream;
      peerConnection.current = new RTCPeerConnection(configuration);
      stream.getTracks().forEach(track => peerConnection.current?.addTrack(track, stream));

      // ICE 후보 이벤트 핸들링
      peerConnection.current.onicecandidate = (event) => {
        console.log("navigator-peerConnection.onicecandidate");
        if (event.candidate) {
          console.log(`navigator-peerConnection.onicecandidate if 문 진입`);
          socket.emit('signal', { signal: event.candidate, room: 'voice_chat_room', from: socket.id });
        }
      };

      // 원격 피어로부터 트랙 수신 이벤트 처리
      peerConnection.current.ontrack = (event) => {
        console.log("navigator-peerConnection.ontrack");
        const audioElement = document.createElement('audio');
        audioElement.srcObject = event.streams[0];
        audioElement.autoplay = true;
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        document.body.appendChild(audioElement); // 오디오 엘리먼트를 DOM에 추가하여 재생
      };

      // 오퍼 생성 및 전송
      peerConnection.current.createOffer().then(offer => {
        console.log("navigator-peerConnection.createOffer");
        peerConnection.current?.setLocalDescription(offer);
        socket.emit('signal', { signal: offer, room: 'voice_chat_room', from: socket.id });
      });
    })
        .catch(error => {
          console.error('Error accessing media devices', error);
        });

    return () => {
      console.log("leaveRoom");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      socket.emit('leaveRoom', { room: 'voice_chat_room' });

      // 연결 정리 및 이벤트 리스너 해제
      peerConnection.current?.close();
      peerConnection.current = null;

      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
        localStream.current = null;
      }

      socket.off('signal', handleSignal);
    };
  }, [userId]);

  return (
      <div>
        <h2>Voice Chat Room</h2>
        <UserList users={users} />
      </div>
  );
};

export default ChatRoom;

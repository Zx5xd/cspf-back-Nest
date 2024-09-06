// src/components/ChatRoom.tsx
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


  console.log("ChatRoom userId = "+userId);
  useEffect(() => {

    
    setUsers(prevUsers => [...prevUsers, {id: userId}]);

    socket.emit('joinRoom', { userId, room: 'voice_chat_room' });

    console.log("ChatRoom socketID = "+socket.id);

    // WebRTC 시그널링 처리
    const handleSignal = async (data: any) => {
        if (data.from !== socket.id && peerConnection.current) {
          try{
            const remoteDescription = new RTCSessionDescription(data.sign);

            if(peerConnection.current.signalingState === 'stable' && remoteDescription.type === 'offer'){
              console.log('Cannot accept offer in stable state');
              return;
            }
            //  await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.signal));
           await peerConnection.current?.setRemoteDescription(remoteDescription);

           if (data.signal.type === 'offer') {
            const answer = await peerConnection.current?.createAnswer();
            await peerConnection.current?.setLocalDescription(answer);
            socket.emit('signal', { signal: answer, room: 'voice_chat_room', from : socket.id });
         }

          }catch(error){
            console.error('Error handling signal:', error);
          }

        }
    };

      // 시그널 이벤트 리스너 설정
      socket.on('signal', handleSignal);

      socket.on('updateUserList', (users) => {
        setUsers(users);
      })

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        console.log("navigator 함수 진입");
      localStream.current = stream;
      peerConnection.current = new RTCPeerConnection(configuration);
      stream.getTracks().forEach(track => peerConnection.current?.addTrack(track, stream));

      peerConnection.current.onicecandidate = (event) => {
        console.log("navigator-peerConnection.onicecandidate");
        if (event.candidate) {
          socket.emit('signal', { signal: event.candidate, room: 'voice_chat_room', from: socket.id });
        }
      };

      peerConnection.current.ontrack = (event) => {
        console.log("navigator-peerConnection.ontrack");
        const audioElement = document.createElement('audio');
        audioElement.srcObject = event.streams[0];
        audioElement.autoplay = true;
        audioElement.play();
      };

      peerConnection.current.createOffer().then(offer => {
        console.log("navigator-peerConnection.createOffer");
        peerConnection.current?.setLocalDescription(offer);
        socket.emit('signal', { signal: offer, room: 'voice_chat_room', from: socket.id});
      });
    })
    .catch(error => {
      console.error('Error accessing media devices', error);
    });

    return () => {// 시그널 이벤트 리스너 정리
       
        console.log("leaveRoom");
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      socket.emit('leaveRoom', { room: 'voice_chat_room' });

      // 연결 정리 및 이벤트 리스너 해제
      peerConnection.current?.close();
      peerConnection.current = null;


      if(localStream.current){
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

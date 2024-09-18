import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const ITTComponent: React.FC = () => {
  // 이미지 텍스트 추출.
  const [file, setFile] = useState<File | null>(null); // 선택된 파일 상태
  const [message, setMessage] = useState<string>(''); // 업로드 상태 메시지

  // 파일 선택 시 호출되는 함수
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // 파일 업로드 함수
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // 'file'은 서버에서 받아주는 필드명과 일치해야 함

    try {
      // 파일 업로드 요청
      const response = await axios.post('http://localhost:3500/image/extract-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`File uploaded successfully.`);
      setMessage(JSON.stringify(response.data));
      console.log('Response:', response.data); // 서버로부터의 응답

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ITTComponent;

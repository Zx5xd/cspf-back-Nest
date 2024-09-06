import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { SearchNewsList, SearchLawList, SearchAniInfo } from './searchList';
import VoiceChat from './VoiceChat'; // VoiceChat 컴포넌트를 import
import Email from './emailV';
import EmailBut from './mainBut';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmailBut />} />
        <Route path="/searchNews" element={<SearchNewsList />} />
        <Route path="/voiceChat" element={<VoiceChat />} /> {/* VoiceChat 라우트 추가 */}
        <Route path="/caseLaw" element={<SearchLawList />} />
        <Route path="/aniInfo" element={<SearchAniInfo />} />
        <Route path="/email" element={<Email />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

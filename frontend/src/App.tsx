import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
// import { SearchNewsList, SearchLawList, SearchAniInfo } from './search/searchList';
import {SearchNewsList} from "./components/search/SearchNewsList";
import {SearchLawList} from "./components/search/SearchLawList";
import {SearchAniInfo} from "./components/search/SearchAniInfo";
import VoiceChat from './VoiceChat'; // VoiceChat 컴포넌트를 import
import Email from './emailV';
import EmailBut from './mainBut';
import ITTComponent from "./components/ITTComponent";

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
        <Route path={"/itt"} element={<ITTComponent/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

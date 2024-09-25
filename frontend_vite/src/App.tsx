// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginCallback from './pages/LoginCallback';
import EmailBut from "./mainBut.tsx";
import {SearchNewsList} from "./components/search/SearchNewsList.tsx";
import {SearchLawList} from "./components/search/SearchLawList.tsx";
import {SearchAniInfo} from "./components/search/SearchAniInfo.tsx";
import Email from "./emailV.tsx";
import Itt from "./components/ITTComponent.tsx";
import VoiceChat from "./VoiceChat.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/pass" element={<Home />} />
                <Route path="/auth/naver/callback" element={<LoginCallback />} />
                <Route path="/" element={<EmailBut />} />
                <Route path="/searchNews" element={<SearchNewsList />} />
                <Route path="/voiceChat" element={<VoiceChat />} /> {/* VoiceChat 라우트 추가 */}
                <Route path="/caseLaw" element={<SearchLawList />} />
                <Route path="/aniInfo" element={<SearchAniInfo />} />
                <Route path="/email" element={<Email />} />
                <Route path="/itt" element={<Itt />} />
            </Routes>
        </Router>
    );
};

export default App;

import React from 'react';
import '../../App.css'
import '../../style/list.css';
import { CommonList } from '../commonList';
import { ForumItemProps } from '../forum/PropInterface'; // 인터페이스 파일
import { forumMap } from "../forum/ForumMaps";
import {NewsData} from "./searchInterface";

const newsMapper = (data: any): ForumItemProps[] => {
    return data.items.map((news: NewsData) => ({
        title: news.title,
        link: news.link,
        description: news.description,
        pubDate: news.pubDate,
        types: 'pubDate',
    }));
};

export const SearchNewsList: React.FC = () => {
    return (
        <CommonList
            types={`searchNews`}
            dataMapper={newsMapper}
            render={forumMap}
        />
    );
};

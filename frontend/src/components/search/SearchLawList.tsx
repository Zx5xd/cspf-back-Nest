import React from 'react';
import '../../App.css'
import '../../style/list.css';
import { CommonList } from '../commonList';
import { ForumItemProps } from '../forum/PropInterface'; // 인터페이스 파일
import { forumMap } from "../forum/ForumMaps";

const lawMapper = (data: any): ForumItemProps[] => {
    return data.prec.map((laws: any) => ({
        title: laws.사건명,
        link: 'https://www.law.go.kr' + laws.판례상세링크,
        description: `${laws.사건번호} ${laws.법원명}`,
        pubDate: laws.선고일자,
        types: laws.판결유형,
    }));
};

export const SearchLawList: React.FC = () => {
    return (
        <CommonList
            types={'caseLaw'}
            dataMapper={lawMapper}
            render={forumMap}
        />
    );
};

import React from 'react';
import '../../App.css'
import '../../style/list.css';
import { CommonList } from '../commonList';
import { AniInfoMap } from "../forum/ForumMaps";
import { AniInfoProps } from '../forum/PropInterface'; // 인터페이스 파일


const aniInfoMapper = (data: any): AniInfoProps[] => {
    // data가 없으면 빈 배열 반환
    if (!data) {
        console.warn("Data is undefined or null");
        return []; // 로딩 상태를 반영하는 로직은 다른 곳에서 처리
    }else{
        console.log(`Data is ${data}`);
    }

    data = [data];
    console.log(data);

    // 유효한 데이터를 반환
    return data.item.map((ani: AniInfoProps) => ({
        dogRegNo: ani.dogRegNo,
        dogNm: ani.dogNm,
        sexNm: ani.sexNm,
        kindNm: ani.kindNm,
        neuterYn: ani.neuterYn,
    }));
};


export const SearchAniInfo: React.FC = () => {
    return (
        <CommonList
            types="aniInfo"
            dataMapper={aniInfoMapper}
            render={AniInfoMap}
        />
    );
};

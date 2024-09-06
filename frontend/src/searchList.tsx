import React, { useState, useEffect } from 'react';
import './App.css'; // App.css 파일을 임포트
import './style/list.css';
import { Row, Col, Container } from 'react-bootstrap';

interface ForumItemProps {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  types: string;
}

interface AniInfoProps {
  dogRegNo: string;
  dogNm: string;
  sexNm: string;
  kindNm: string;
  neuterYn: string;
}

interface AniInfoData {
  dogRegNo: string;
  dogNm: string;
  sexNm: string;
  kindNm: string;
  neuterYn: string;
}

interface NewsData {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  types: string;
}

interface LawData {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  types: string;
}

function TagRemove(obj: string | any): string {
  if (typeof obj === 'string')
    return obj.replace(/(<([^>]+)>)/ig, "").replace(/"n/, "").replace(/&amp;/g, "").replace(/&quot;/g, "");
  else return obj;
}

const ForumItem: React.FC<ForumItemProps> = ({ title, link, description, pubDate, types }) => {
  console.log(`Forum, Title=${title},\n link = ${link},\n desc=${description},\n pubDate=${pubDate},\n types=${types}`);
  return (
    <div className="forum-item">
      <Row>
        <Col md={9} sm={10}>
          <a href={link} className="forum-item-title">{TagRemove(title)}</a>
          <div className="forum-sub-title">{TagRemove(description)}</div>
        </Col>
        <Col md={2} className="forum-info">
          <span className="views-number">{pubDate}</span>
          <div><small>{types}</small></div>
        </Col>
      </Row>
    </div>
  );
}

const AniInfo: React.FC<AniInfoProps> = ({ dogRegNo, dogNm, sexNm, kindNm, neuterYn }) => {
  console.log(`Forum, Title=${dogRegNo},\n link = ${dogNm},\n desc=${sexNm},\n pubDate=${kindNm},\n types=${neuterYn}`);
  return (
    <div className="forum-item">
      <Row>
        <Col md={9} sm={10}>
          <p className="forum-item-title">{TagRemove(dogRegNo)}</p>
          <div className="forum-sub-title">{TagRemove(dogNm)}</div>
        </Col>
        <Col md={2} className="forum-info">
          <span className="views-number">{sexNm}</span>
          <div><small>{kindNm}</small></div>
        </Col>
      </Row>
    </div>
  );
}

const forumMap = (forumItems: ForumItemProps[]) => {
  return (
    <Container>
      <Row>
        <Col lg={12}>
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="ibox-content m-b-sm border-bottom">
              <div className="p-xs">
                <h2>Welcome to our forum</h2>
                <span>Feel free to choose topic you're interested in.</span>
              </div>
            </div>
            <div className="ibox-content forum-container">
              <div className="forum-title">
                <h3>General subjects</h3>
              </div>
              {forumItems.map((item, index) => (
                <ForumItem
                  key={index}
                  title={item.title}
                  link={item.link}
                  description={item.description}
                  pubDate={item.pubDate}
                  types={item.types}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const AniInfoMap = (Infos: AniInfoProps[]) => {
  return (
    <Container>
      <Row>
        <Col lg={12}>
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="ibox-content m-b-sm border-bottom">
              <div className="p-xs">
                <h2>Welcome to our forum</h2>
                <span>Feel free to choose topic you're interested in.</span>
              </div>
            </div>
            <div className="ibox-content forum-container">
              <div className="forum-title">
                <h3>General subjects</h3>
              </div>
              {Infos.map((item, index) => (
                <AniInfo
                  key={index}
                  dogRegNo={item.dogRegNo}
                  dogNm={item.dogNm}
                  sexNm={item.sexNm}
                  kindNm={item.kindNm}
                  neuterYn={item.neuterYn}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export const SearchAniInfo: React.FC = () => {
  const [forumItems, setForumItems] = useState<AniInfoProps[]>([]);

  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const query = urlParam.get('query');

  useEffect(() => {
    fetch(`http://localhost:3500/aniInfo`)
      .then(response => response.json())
      .then((aniData) => {
        const aniInfos = aniData.items.map((ani: AniInfoData, index: number) => ({
          dogRegNo: ani.dogRegNo,
          dogNm: ani.dogNm,
          sexNm: ani.sexNm,
          kindNm: ani.kindNm,
          neuterYn: ani.neuterYn
        }));
        setForumItems(aniInfos);
      }).catch(error => console.error('Error fetching aniInfo data:', error));
  }, [query]);

  return AniInfoMap(forumItems);
}

export const SearchNewsList: React.FC = () => {
  const [forumItems, setForumItems] = useState<NewsData[]>([]);

  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const query = urlParam.get('query');

  useEffect(() => {
    fetch(`http://localhost:3500/searchNews?query=${query}`)
      .then(response => response.json())
      .then((newsData) => {

        let parsedData;
        try {
          parsedData = JSON.parse(newsData);
          console.log(`Parsed Data:`, parsedData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
          return; // 파싱 실패 시 함수 종료
        }

        const newsItems = parsedData.items.map((news: NewsData, index: number) => ({
          title: news.title,
          link: news.link,
          description: news.description,
          pubDate: news.pubDate,
          types: 'pubDate'
        }));
        setForumItems(newsItems);
      }).catch(error => console.error('Error fetching case news data:', error));
  }, [query]);

  return forumMap(forumItems);
}

export const SearchLawList: React.FC = () => {
  const [forumItems, setForumItems] = useState<LawData[]>([]);

  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const query = urlParam.get('query');

  useEffect(() => {
    fetch(`http://localhost:3500/caseLaw?query=${query}`)
      .then(response => response.json())
      .then((caseLawData) => {
        console.log(`caseLawData: ${caseLawData}`);
        console.log(`caseLawData type: ${typeof caseLawData}`)

        let parsedData;
        try {
          parsedData = JSON.parse(caseLawData);
          console.log(`Parsed Data:`, parsedData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
          return; // 파싱 실패 시 함수 종료
        }


        const caseLawItems = parsedData.prec.map((laws: any, index: number) => ({
          title: laws.사건명,
          link: 'https://www.law.go.kr' + laws.판례상세링크,
          description: `${laws.사건번호} ${laws.법원명}`,
          pubDate: laws.선고일자,
          types: laws.판결유형
        }));
        setForumItems(caseLawItems);
      }).catch(error => console.error('Error fetching case laws data:', error));
  }, [query]);

  return forumMap(forumItems);
}

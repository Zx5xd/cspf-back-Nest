import {AniInfo, NewsForumItem, LawsForumItem} from "./ForumItems";
import {AniInfoProps, ForumItemProps} from "./PropInterface";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";

export const forumMap = (forumItems: ForumItemProps[]) => {
    const renderType = forumItems.map((item, index) => item.link.includes('n.news.naver.com'));
    console.log(renderType[0]);

    return <Container>
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
                        {forumItems.map((item, index) => renderType[0] === true ? (
                            <NewsForumItem
                                key={index}
                                title={item.title}
                                link={item.link}
                                description={item.description}
                                pubDate={item.pubDate}
                                types={item.types}
                            />):
                            (<LawsForumItem key={index} title={item.title} link={item.link} description={item.description} pubDate={item.description} types={item.types}/>)
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    </Container>;
}

export const AniInfoMap = (Infos: AniInfoProps[]) => {
    console.log(`InfoMaps`);
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
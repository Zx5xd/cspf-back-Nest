import React, {useEffect} from "react";
import { useState } from "react";
import {Col, Row} from "react-bootstrap";
import { Collapse} from "react-bootstrap";
// import {CCollapse} from "@coreui/react";
import {TagRemove} from "../../util/tagRemove";
import {fetchUrl} from "../../util/fetchData";
import {urlProp, AniInfoProps, ForumItemProps} from "./PropInterface";

const SendUrl: React.FC<urlProp> = ({url}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [content, setContent] = useState<string>('');

    useEffect(() => {
            const getContent = async (): Promise<any> => {
                const resContent = await fetchUrl(url);
                const cleanedContent = TagRemove(resContent);
                setContent(cleanedContent);
            };

            getContent();
        },
        [url]);

    return (
        <p>
            {content}
        </p>
    );
}

export const NewsForumItem: React.FC<ForumItemProps> = ({ title, link, description, pubDate, types }) => {
    // console.log(`Forum, Title=${title},\n link = ${link},\n desc=${description},\n pubDate=${pubDate},\n types=${types}`);
    const [open, setOpen] = useState(false);

    return (
        <div className="forum-item">
            <Row>
                <Col md={9} sm={10}>
                    <a href='#' className="forum-item-title" onClick={()=> setOpen(!open)}>{TagRemove(title)}</a>
                    <div className="forum-sub-title">{TagRemove(description)}</div>
                </Col>
                <Col md={3} className="forum-info">
                    <span className="views-number">{pubDate}</span>
                    <div><small>{types}</small></div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Collapse in={open}>
                        <div className="forum-item-content">
                            <SendUrl url={link}/>
                        </div>
                    </Collapse>
                </Col>
            </Row>
        </div>
    );
}

export const LawsForumItem: React.FC<ForumItemProps> = ({ title, link, description, pubDate, types }) => {
    // console.log(`Forum, Title=${title},\n link = ${link},\n desc=${description},\n pubDate=${pubDate},\n types=${types}`);
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

export const AniInfo: React.FC<AniInfoProps> = ({ dogRegNo, dogNm, sexNm, kindNm, neuterYn }) => {
    console.log(`ForumItems, Title=${dogRegNo},\n link = ${dogNm},\n desc=${sexNm},\n pubDate=${kindNm},\n types=${neuterYn}`);
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
                    <p>{neuterYn}</p>
                </Col>
            </Row>
        </div>
    );
}


import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LawApiService {
  constructor(private config: ConfigService) {}

  private oc = this.config.get('MAIL_ID'); // 고유 코드 설정

  // XML을 JSON으로 변환하는 함수
  private async fetchAndParseXML(url: string): Promise<any> {
    const parser = new xml2js.Parser({ explicitArray: false });

    try {
      // HTTP GET 요청을 통해 URL에서 XML 데이터 가져오기
      const response = await axios.get(url, { responseType: 'text' });

      // XML 데이터를 JavaScript 객체로 변환
      const result = await parser.parseStringPromise(response.data);
      // 변환된 결과에서 날짜 형식을 포맷팅
      for (const key in result.PrecSearch.prec) {
        const dateVar = new Date(result.PrecSearch.prec[key].선고일자);
        const formatDate = `${dateVar.getFullYear()}년 ${
            dateVar.getMonth() + 1
        }월 ${dateVar.getDate()}일`;
        result.PrecSearch.prec[key].선고일자 = formatDate;
      }

      return result.PrecSearch;
    } catch (error) {
      console.error('Error fetching or parsing XML:', error);
      throw new HttpException(
          'Failed to fetch or parse XML data',
          HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 법률 API를 호출하여 데이터를 가져오는 함수
  async getCaseLaw(query: string): Promise<any> {
    const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${encodeURIComponent(
        this.oc,
    )}&target=prec&type=XML&query=${encodeURIComponent(query)}`;

    console.log(`getCaseLaw URL : ${url}`);

    return this.fetchAndParseXML(url);
  }
}

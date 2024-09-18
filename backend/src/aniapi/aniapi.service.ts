import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class AniApiService {
  // XML 문자열을 JSON 객체로 변환하는 함수
  private xmlToJson(xml: string): Promise<any> {
    const parser = new xml2js.Parser({ explicitArray: false });
    return new Promise((resolve, reject) => {
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // AniInfo API를 호출하는 함수
  async getAniInfo(): Promise<any> {
    const parser = new xml2js.Parser({ explicitArray: false });

    console.log('getAniInfo 시작');
    const url = 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo';
    let queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=' +
      encodeURIComponent('ulKK8tC5tkD4PAdqkFiF5APBX0NJeTQs3ZfjlO3Tbi8C96+ymyrvxD0QAO/RBTZny/SO/99tjrtRRo+x6XpSAw=='); // 실제 서비스 키로 대체
    queryParams +=
      '&' + encodeURIComponent('dog_reg_no') + '=' + encodeURIComponent('411984951919549');
    queryParams +=
      '&' + encodeURIComponent('owner_nm') + '=' + encodeURIComponent('김형진');

    // console.log('queryParams 끝');
    try {
      // console.log('Http get 요청 시작');
    
        // HTTP GET 요청을 보냅니다.
      const response = await axios.get(url + queryParams, {
        responseType: 'text', // XML 응답을 문자열로 받기 위해 설정
      });

      // console.log('http get 요청 끝');
      //
      // console.log(response.data);
      //
      // console.log('animalInfo xml => JSON 변환 시작');

      // XML을 JSON으로 변환합니다.
      const animalInfo = await parser.parseStringPromise(response.data);

 //      console.log(`animalInfo xml => JSON 변환 끝
 // ${JSON.stringify(animalInfo.response.body.item)}`);

      // 변환된 데이터를 반환합니다.
      return JSON.stringify(animalInfo.response);
    } catch (error) {
      // 오류 발생 시 적절한 예외를 던집니다.
      throw new HttpException(
        'Failed to fetch animal info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

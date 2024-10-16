import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';
import {petDto} from "../../pet/dto/pet.dto";

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
  async getAniInfo(owner: string, petId: string): Promise<petDto> {
    const parser = new xml2js.Parser({ explicitArray: false });

    console.log('getAniInfo 시작');
    const url = 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo';
    let queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=' +
      encodeURIComponent(process.env.ANIMAL_API_KEY); // 실제 서비스 키로 대체
    queryParams += '&' + encodeURIComponent('dog_reg_no') + '=' + petId;
    //     '&' + encodeURIComponent('dog_reg_no') + '=' + encodeURIComponent('411984951919549');
    queryParams += '&' + encodeURIComponent('owner_nm') + '=' + owner;
    //   '&' + encodeURIComponent('owner_nm') + '=' + encodeURIComponent('김형진');

    try {
      // HTTP GET 요청을 보냅니다.
      const response = await axios.get(url + queryParams, {
        responseType: 'text', // XML 응답을 문자열로 받기 위해 설정
      });

      // XML을 JSON으로 변환합니다.
      const animalJSON = await parser.parseStringPromise(response.data);
      const animalInfo = animalJSON.response.body.item;
      const animalData: petDto = animalInfo;
      console.log(animalData);

      // 변환된 데이터를 반환합니다.
      return animalData;
    } catch (error) {
      // 오류 발생 시 적절한 예외를 던집니다.
      throw new HttpException(
        'Failed to fetch animal info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

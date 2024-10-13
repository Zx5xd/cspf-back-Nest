import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { AniApiService } from '../aniapi/aniapi.service';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class ImageExtractService {
  private readonly visionClient: ImageAnnotatorClient;

  constructor(private readonly aniService: AniApiService) {
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_VISION_API_KEY,
    });
  }

  async detextTextFromImage(imageBuffer: Buffer): Promise<string | any[]> {
    // vision 이용
    const [result] = await this.visionClient.textDetection(imageBuffer);
    const detection = result.fullTextAnnotation.text.split('\n');
    //
    // let owner: string;
    // let petId: string;
    //
    // // ':'을 기준으로 key-value 쌍을 객체에 추가
    // detection.forEach((detect) => {
    //   const [key, value] = detect.split(':');
    //   if (key === '보호자') owner = value.trim();
    //   if (key === '등록번호') petId = value.trim();
    // });
    //
    // const aniInfo = await this.aniService.getAniInfo(owner, petId);
    // console.log('image aniInfo', aniInfo);

    return detection;
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    // Tesseract.js 이용.
    const result = await Tesseract.recognize(imageBuffer, 'eng+kor', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  }
}

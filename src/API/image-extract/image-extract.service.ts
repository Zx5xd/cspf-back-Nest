import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { AniApiService } from '../aniapi/aniapi.service';
import * as Tesseract from 'tesseract.js';
import { PetService } from '../../pet/pet.service';

@Injectable()
export class ImageExtractService {
  private readonly visionClient: ImageAnnotatorClient;

  constructor(
    private readonly aniService: AniApiService,
    private readonly petService: PetService,
  ) {
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_VISION_API_KEY,
    });
  }

  async detextTextFromImage(imageBuffer: Buffer): Promise<string | any> {
    // vision 이용
    const [resultVison] = await this.visionClient.textDetection(imageBuffer);
    const detection = resultVison.fullTextAnnotation.text.split('\n');

    let owner: string;
    let petId: string;
    let birth: string;

    console.log(`detect-text: ${detection}`);

    // ':'을 기준으로 key-value 쌍을 객체에 추가
    detection.forEach((detect) => {
      const [key, value] = detect.split(':') ?? detect.split(' ');
      if (key === '보호자') owner = value.trim();
      if (key === '등록번호') petId = value.trim();
      if (key === '생일' || key === '생년월일') birth = value.trim();
    });
    console.log(`보호자: ${owner}, 등록번호: ${petId}, 생일: ${birth}`);

    const aniInfoData = await this.aniService.getAniInfo(owner, petId);
    aniInfoData.Birthday = birth;
    console.log('image aniInfo', aniInfoData);

    const resultDB = this.petService.create(aniInfoData);
    console.log('result', resultDB);

    return resultDB;
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    // Tesseract.js 이용.
    const result = await Tesseract.recognize(imageBuffer, 'eng+kor', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  }
}

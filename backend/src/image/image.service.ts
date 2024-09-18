import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class ImageService {
  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    // Tesseract.js 이용.
    const result = await Tesseract.recognize(imageBuffer, 'eng+kor', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  }
}

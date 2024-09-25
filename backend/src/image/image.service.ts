import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class ImageService {
  private readonly visionClient: ImageAnnotatorClient;

  constructor() {
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_VISION_API_KEY,
    });
  }

  async detextTextFromImage(imageBuffer: Buffer): Promise<string | any[]> {
    const [result] = await this.visionClient.textDetection(imageBuffer);
    console.log(result);
    console.log(typeof result);
    const detection = result.textAnnotations;
    return detection ? detection.map((text) => text.description).join('') : [];
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    // Tesseract.js 이용.
    const result = await Tesseract.recognize(imageBuffer, 'eng+kor', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  }
}

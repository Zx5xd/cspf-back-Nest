import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface news {
  news_author: string;
  news_contents: string;
}

interface laws {
  laws_content: string;
}

@Injectable()
export class ScripingService {
  async scrapeNewssite(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url);
      // console.log(`News axios data: ${JSON.stringify(data)}`);

      const $ = cheerio.load(data);

      // 예: 웹 페이지에서 특정 요소를 찾는 코드
      const result: news[] = [];

      $('em.media_end_head_journalist_name').each((index, element) => {
        result.push(<news>{
          news_author: $(element).text(),
        });
      });

      // 이미지 소스 추출(불가)
      // $('div.nbd_a').each((index, element) => {
      //   result.push($(element).text());
      // });

      $('article._article_content._article_content').each((index, element) => {
        result.push(<news>{
          news_contents: $(element).text(),
        });
      });

      console.log(`result ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape website');
    }
  }

  async ScrapLawsite(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url);
      // console.log(`Laws axios data: ${JSON.stringify(data)}`);

      const $ = cheerio.load(data);

      // 예: 웹 페이지에서 특정 요소를 찾는 코드
      const result: laws[] = [];

      $('div#contentBody').each((index, element) => {
        result.push(<laws>{
          laws_content: $(element).text(),
        });
      });

      console.log(`result ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape website');
    }
  }
}

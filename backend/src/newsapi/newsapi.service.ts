import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NewsApiService {

    private client_id = 'bIJbfHfcyZpcgNsPOhll';
    private client_secret = 'JZnAq8OE2I';

    async getNewsSearch(query: string): Promise<any>{
        const news_api = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(query)
        + '&display='+100+'&start='+1+'&sort=sim';

        const options = {
            headers: {'X-Naver-Client-Id':this.client_id, 'X-Naver-Client-Secret': this.client_secret}
         };

         try{
            const response = await axios.get(news_api, options);

            if(response.status === 200){
                const news_data = response.data;
                console.log(news_data.items);

                for (const key in news_data.items) {
                    if (Object.prototype.hasOwnProperty.call(news_data.items, key)) {
                      const dateVar = new Date(news_data.items[key].pubDate);
                      const formatDate = `${dateVar.getFullYear()}년 ${
                        dateVar.getMonth() + 1
                      }월 ${dateVar.getDate()}일`;
                      news_data.items[key].pubDate = formatDate;
                    }
                  }

                return news_data; // 데이터를 반환합니다.
            } else{
                throw new HttpException(`Error fetching data from Naver API: ${response.status}`, HttpStatus.BAD_REQUEST);
            }
         }catch(error){
            console.error('Error fetching news data:', error);
            throw new HttpException(
                'Failed to fetch news data',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
         }

    }

}

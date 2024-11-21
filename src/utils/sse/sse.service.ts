import { Injectable } from '@nestjs/common';
import {Observable, Subject} from "rxjs";

@Injectable()
export class SseService {
    private userEvents = new Map<string, Subject<any>>();

    sendEvent(data: any){
        this.userEvents.forEach((value) => {
            value.next(data)
        });
    }

    /**
     * 특정 사용자에 대한 이벤트 스트림 가져오기
     * @param userCode 사용자 식별 코드
     */
    getUserEvents(userCode: string): Observable<any> {
        if (!this.userEvents.has(userCode)) {
            this.userEvents.set(userCode, new Subject<any>());
        }
        return this.userEvents.get(userCode).asObservable();
    }

    /**
     * 특정 사용자에게 이벤트 전송
     * @param userCode 사용자 식별 코드
     * @param data 전송할 데이터
     */
    sendEventToUser(userCode: string, data: any) {
        const userEvent = this.userEvents.get(userCode);
        if (userEvent) {
            userEvent.next(data);
        }
    }

    /**
     * 사용자 연결 종료 처리
     * @param userCode 사용자 식별 코드
     */
    removeUserEvents(userCode: string) {
        const userEvent = this.userEvents.get(userCode);
        if (userEvent) {
            userEvent.complete();
            this.userEvents.delete(userCode);
        }
    }
}

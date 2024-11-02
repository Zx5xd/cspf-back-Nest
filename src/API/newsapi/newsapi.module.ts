import { Module } from '@nestjs/common';
import {NewsApiService} from "./newsapi.service";
import {NewsapiController} from "./newsapi.controller";
import {ScripingService} from "../../utils/scriping/scriping.service";
import {ScripingController} from "../../utils/scriping/scriping.controller";

@Module({
    providers:[NewsApiService, ScripingService],
    controllers:[NewsapiController, ScripingController],
    exports:[NewsApiService]
})
export class NewsapiModule {}

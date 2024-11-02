import {Module} from "@nestjs/common";
import {LawApiService} from "../lawapi/lawapi.service";
import {LawApiController} from "../lawapi/lawapi.controller";
import {AniApiService} from "./aniapi.service";
import {AniapiController} from "./aniapi.controller";

@Module({
    providers:[AniApiService],
    controllers:[AniapiController],
    exports:[AniApiService]
})

export class AniapiModule{}
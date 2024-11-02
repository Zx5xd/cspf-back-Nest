import {Module} from "@nestjs/common";
import {LawApiService} from "./lawapi.service";
import {LawApiController} from "./lawapi.controller";

@Module({
    providers:[LawApiService],
    controllers:[LawApiController],
    exports:[LawApiService]
})

export class LawapiModule{}
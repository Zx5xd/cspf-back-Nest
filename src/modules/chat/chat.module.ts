import {Module} from "@nestjs/common";
import {ChatGateway} from "./chat.gateway";
import {ChatLogModule} from "../chatlog/chatlog.module";
import {ChatService} from "./chat.service";

@Module({
    imports:[ChatLogModule],
    providers:[ChatGateway,ChatService],
    exports:[ChatService]
})
export class ChatModule {}
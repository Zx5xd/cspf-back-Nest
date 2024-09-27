import {Module} from "@nestjs/common";
import {ChatGateway} from "./chat.gateway";
import {ChatLogModule} from "../chatlog/chatlog.module";

@Module({
    imports:[ChatLogModule],
    providers:[ChatGateway],
    exports:[ChatGateway]
})
export class ChatModule {}
import {forwardRef, Module} from "@nestjs/common";
import {ChatGateway} from "./chat.gateway";
import {ChatLogModule} from "../chatlog/chatlog.module";
import {ChatService} from "./chat.service";
import {UserModule} from "@/modules/user/user.module";
import {PetModule} from "@/modules/pet/pet.module";

@Module({
    imports:[ChatLogModule, forwardRef(() => UserModule), PetModule],
    providers:[ChatGateway,ChatService],
    exports:[ChatService]
})
export class ChatModule {}
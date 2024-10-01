import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {Repository} from "typeorm";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository:Repository<QuestionsEntity>
  ) {}


}
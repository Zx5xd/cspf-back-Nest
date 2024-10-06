import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {Repository} from "typeorm";
import {QuestionsReplyEntity} from "./questions_reply.entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository:Repository<QuestionsEntity>,
    @InjectRepository(QuestionsReplyEntity)
    private readonly questionReplyRepository:Repository<QuestionsReplyEntity>
  ) {}

  //게시판 기능
  async createQuestion(authorCode:string, content:string) {
    const result = await this.questionRepository.create({code:authorCode,content:content})
    await this.questionReplyRepository.save(result)
    return result.id;
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne(id:number) {
   return await this.questionRepository.findOne({where:{id}})
  }

  async pagination(page:number,limit:number) {
    const [data, total] = await this.questionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(id:number, content:string) {
    const updateData: QueryDeepPartialEntity<QuestionsEntity> = {
      content: content
    }
    const result = await this.questionRepository.update(id,updateData);
    return result.affected > 0;
  }

  async delete(id:number) {
    await this.questionRepository.delete(id);
  }

  //게시판 댓글 기능
  async createReply(boardId:number, authorCode:string, content:string) {
    const result = await this.questionReplyRepository.create({boardId,authorCode,content});
    await this.questionReplyRepository.save(result);

    return result
  }

  async findBoardReplies(boardId:number) {
    return await this.questionReplyRepository.find({where:{boardId},order:{createdAt:'ASC'}})
  }

  async findBoardReply(replyId:number) {
    return await this.questionReplyRepository.findOne({where:{id:replyId}})
  }

  async updateBoardReply(replyId:number, content:string) {
    const updateData: QueryDeepPartialEntity<QuestionsReplyEntity> = {
      content: content
    }
    const result = await this.questionReplyRepository.update(replyId,updateData)
    return result.affected > 0;
  }

  async deleteBoardReply(replyId:number) {
    await this.questionReplyRepository.delete(replyId);
  }
}
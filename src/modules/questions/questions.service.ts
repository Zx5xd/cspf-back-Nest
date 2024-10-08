import {ForbiddenException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuestionsEntity} from "./questions.entity";
import {Repository, UpdateResult} from "typeorm";
import {QuestionsCommentsEntity} from "./questions_comments.entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {QuestionsDto} from "../../dto/questions.dto";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository:Repository<QuestionsEntity>,
    @InjectRepository(QuestionsCommentsEntity)
    private readonly questionCommentsRepository:Repository<QuestionsCommentsEntity>
  ) {}

  //게시판 기능
  async createQuestion(authorCode:string, questionDto:QuestionsDto):Promise<number> {
    const {title,content} = questionDto;
    const result:QuestionsEntity = await this.questionRepository.create({title,authorCode,content})
    await this.questionRepository.save(result)
    return result.id;
  }

  async findAll() {
    return await this.questionRepository.createQueryBuilder('questions')
      .select(['questions.id','questions.title','questions.authorCode','questions.createdAt']).getMany();
  }

  async findOne(id:number):Promise<QuestionsEntity> {
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

  async update(code:string, id:number, questionsDto:QuestionsDto):Promise<boolean> {
    // const updateData: QueryDeepPartialEntity<QuestionsEntity> = {
    //   content: content
    // }
    const exist:QuestionsEntity = await this.questionRepository.findOne({where:{id,authorCode:code}})
    if (!exist) {
      throw new ForbiddenException('Access denied or empty');
    }
    const result:UpdateResult = await this.questionRepository.update(id,questionsDto);
    return result.affected > 0;
  }

  async delete(authorCode:string,id:number):Promise<void> {
    const exist:QuestionsEntity = await this.questionRepository.findOne({where:{id,authorCode}})
    if (!exist) {
      throw new ForbiddenException('Access denied or empty, question board is delete failed.');
    }
    await this.questionRepository.delete(id);
  }

  //게시판 댓글 기능
  async createComment(boardId:number, authorCode:string, content:string):Promise<QuestionsCommentsEntity> {
    const result:QuestionsCommentsEntity = await this.questionCommentsRepository.create({boardId,authorCode,content});
    await this.questionCommentsRepository.save(result);

    return result
  }

  async findBoardComments(boardId:number):Promise<QuestionsCommentsEntity[]> {
    return await this.questionCommentsRepository.find({where:{boardId},order:{createdAt:'ASC'}})
  }

  async findBoardComment(commentId:number,authorCode:string):Promise<QuestionsCommentsEntity> {
    await this.existAccessComment(commentId,authorCode);
    return await this.questionCommentsRepository.findOne({where:{id:commentId}})
  }

  async updateBoardComment(commentId:number, authorCode:string, content:string):Promise<boolean> {
    const updateData: QueryDeepPartialEntity<QuestionsCommentsEntity> = {
      content: content
    }
    const result:UpdateResult = await this.questionCommentsRepository.update(commentId,updateData)
    return result.affected > 0;
  }

  async deleteBoardComment(commentId:number,authorCode:string):Promise<void> {
    await this.existAccessComment(commentId,authorCode);
    await this.questionCommentsRepository.delete(commentId);
  }

  async existAccessComment(id:number,authorCode:string) {
    const result:QuestionsCommentsEntity = await this.questionCommentsRepository.findOne({where:{id,authorCode}})
    if (!result) {
      throw new ForbiddenException('Access denied or empty');
    }
  }
}
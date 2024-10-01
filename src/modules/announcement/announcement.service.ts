import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {AnnouncementEntity} from "./announcement.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository:Repository<AnnouncementEntity>
  ) {}

  async createAnnouncement(adminCode:string,content:string) {
    const result = await this.announcementRepository.create({admin:{adminCode:adminCode},content:content});
    await this.announcementRepository.save(result);

    return result.id
  }

  async getAnnouncements(page:number = 1,limit:number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.announcementRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async getAnnouncementBoard(id:number) {
    return await this.announcementRepository.findOne({where:{id}})
  }

  async deleteAnnouncementBoard(id:number) {
    await this.announcementRepository.delete(id);
  }
}
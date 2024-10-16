import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('Pet')
@Unique(['dogRegNo'])
export class PetEntity {
  @PrimaryColumn({ type: 'varchar', length: 15, comment: '동물등록번호' })
  dogRegNo: string; // 동물등록번호

  @Column({ type: 'varchar', length: 20, comment: '동물이름' })
  dogNm: string; // 동물이름

  @Column({ type: 'varchar', length: 20, comment: '성별' })
  sexNm: string; // 성별

  @Column({ type: 'varchar', length: 20, comment: '견 OR 묘', nullable: true })
  petType: string; // 강아지 or 고양이

  @Column({ type: 'varchar', length: 50, comment: '품종' })
  kindNm: string; // 품종

  @Column({ type: 'varchar', length: 20, comment: '중성화 여부' })
  neuterYn: string; // 중성화여부

  @Column({ type: 'varchar', length: 20, comment: '반려동물 출생일' })
  Birthday: string;

  @Column({ type: 'varchar', length: 20, comment: '등록증 유효여부' })
  aprGbNm: string; // 승인여부
}

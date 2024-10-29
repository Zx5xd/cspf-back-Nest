import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('naverUser')
export class NaverUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    naverId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;
}

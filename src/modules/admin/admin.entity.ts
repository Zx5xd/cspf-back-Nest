import {BaseEntity, Column, Entity, PrimaryColumn, Unique} from "typeorm";

@Entity('Admin')
@Unique(['username'])
export class AdminEntity extends BaseEntity {
    @PrimaryColumn({type:'varchar',length:10})
    adminCode:string;

    @Column({type:"varchar",length:255})
    username:string;
    @Column({type:"varchar",length:255})
    password:string;
    @Column({type:"varchar",length:255})
    nickname:string;
    @Column({type:'text', nullable: true})
    refreshToken: string;
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';

export enum TodoStatus {
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'complete',
}

@Entity()
export class TechNotesModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

}
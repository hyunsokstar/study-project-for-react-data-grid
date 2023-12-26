import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';

export enum TodoStatus {
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'complete',
}

@Entity()
export class TodosModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task: string;

    @Column({ nullable: true })
    details: string;

    @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.READY, nullable: true })
    status: TodoStatus;

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ type: 'int', default: 1, nullable: true })
    priority: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    manager: UsersModel;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    supervisor: UsersModel;
}
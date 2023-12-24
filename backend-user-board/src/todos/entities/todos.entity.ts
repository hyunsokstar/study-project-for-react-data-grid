import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';

export enum TodoStatus {
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'completed',
}

@Entity()
export class TodosModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task: string;

    @Column({ nullable: true })
    details: string;

    @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.READY })
    status: TodoStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ type: 'int', default: 1 })
    priority: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE' })
    manager: UsersModel;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE' })
    supervisor: UsersModel;
}
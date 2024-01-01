import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TechNotesModel } from './techNotes.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Entity()
export class SkilNotesModel {
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

    @ManyToOne(() => TechNotesModel, { onDelete: "CASCADE", nullable: true })
    techNote: TechNotesModel;

    @ManyToOne(() => UsersModel)
    user: UsersModel;

}

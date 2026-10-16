import { TaskStatus } from '../../enums/status.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string

    @Column({ type: 'text', nullable: true })
    description?: string

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Column({ type: 'timestamptz', nullable: true })
    dueDate?: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date;


    @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    authorId: number;
}

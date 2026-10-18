import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateTaskDto, userId: number) {
    const task = this.tasksRepository.create({ ...dto, authorId: userId });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: number) {
    return this.tasksRepository.find({
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.tasksRepository.findOneBy({ id, authorId: userId });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(id: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
    return { message: `Task ${id} deleted` };
  }
}

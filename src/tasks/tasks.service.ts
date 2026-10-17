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

  async create(createTaskDto: CreateTaskDto) {
  await this.usersService.findOne(createTaskDto.authorId); // throws 404 if missing
  const task = this.tasksRepository.create(createTaskDto);
  return this.tasksRepository.save(task);
}

findAll() {
  return this.tasksRepository.find({
    relations: { author: true },
    order: { createdAt: 'DESC' },
  });
}

async findOne(id: number) {
  const task = await this.tasksRepository.findOne({
    where: { id },
    relations: { author: true },
  });
  if (!task) {
    throw new NotFoundException(`Task with id ${id} not found`);
  }
  return task;
}

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    await this.tasksRepository.remove(task);
    return { message: `Task ${id} deleted` };
  }
}
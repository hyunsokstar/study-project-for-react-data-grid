// TodosService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosModel } from './entities/todos.entity';
import { DtoForCreateTodo } from './dtos/createTodo.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(TodosModel)
        private readonly todosRepository: Repository<TodosModel>,

        @InjectRepository(UsersModel) // UsersModel의 Repository를 주입합니다.
        private readonly usersRepository: Repository<UsersModel>,

    ) { }

    async create(createTodoDto: DtoForCreateTodo): Promise<TodosModel> {
        const { task, details, status, startTime, deadline, priority, supervisorId, managerId } = createTodoDto;

        const managerEntity = await this.usersRepository.findOne({
            where: {
                id: managerId
            }
        });

        const superVisorEntity = await this.usersRepository.findOne({
            where: {
                id: supervisorId
            }
        });

        const todo = this.todosRepository.create({
            task,
            details,
            status,
            startTime,
            deadline,
            priority,
            manager: managerEntity,
            supervisor: superVisorEntity,
        });

        return this.todosRepository.save(todo);
    }

    async getTodosList(
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<
        { todoList: TodosModel[], totalCount: number, perPage: number, usersEmailInfo: string[] }
    > {

        const userEmailList = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.email AS user_email')
            .getRawMany();

        const usersEmailInfo = userEmailList.map(item => item.user_email);
        console.log("usersEmailInfo : ", usersEmailInfo);

        const [todoList, totalCount] = await this.todosRepository.findAndCount({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['manager', 'supervisor'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
            order: {
                id: 'DESC'
            }
        });

        return {
            usersEmailInfo,
            todoList,
            totalCount,
            perPage
        }

        // return this.todosRepository
        //     .createQueryBuilder('todo')
        //     .leftJoinAndSelect('todo.manager', 'user') // 매니저 정보를 가져오기 위한 Left Join
        //     .getMany();
    }

}

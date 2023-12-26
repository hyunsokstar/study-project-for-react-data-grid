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

    async saveTodos(todoRowsForSave: any[]): Promise<any> {

        console.log("todoRowsForSave : ", todoRowsForSave);
        console.log("todoRowsForSave.length : ", todoRowsForSave.length);

        let count = 0;

        for (const todo of todoRowsForSave) {
            const { id, email, nickname, task, ...data } = todo;

            console.log("task check : ", task);

            // 이메일로 해당하는 유저를 찾음
            const manager = await this.usersRepository.findOne({ where: { email: todo.email } });


            if (manager) {
                if (id) {
                    const existingTodo = await this.todosRepository.findOne({ where: { id: id } }); // 변경된 부분
                    if (existingTodo) {

                        if (todo.status === "ready") {
                            count += 1
                            console.log("update check 111111111111111111111");
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                startTime: null,
                                deadline: null
                            });
                        }
                        else if (todo.status === "progress") {
                            count += 1
                            console.log("update check 111111111111111111111");
                            if (existingTodo.startTime === null) {
                                await this.todosRepository.update(id, {
                                    manager: manager, // 찾은 유저 객체를 할당
                                    task: todo.task,
                                    status: todo.status,
                                    startTime: new Date(), // 현재 시간 할당
                                    deadline: null
                                });
                            } else {
                                await this.todosRepository.update(id, {
                                    manager: manager, // 찾은 유저 객체를 할당
                                    task: todo.task,
                                    status: todo.status,
                                    // startTime: new Date(),
                                    deadline: null
                                });
                            }

                            // return { message: `Todos updated successfully ${count}` };
                        }
                        else if (todo.status === "testing") {
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                deadline: null
                                // deadline: todo.deadline
                            });
                        }

                        else if (todo.status === "complete") {
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                deadline: new Date(), // 현재 시간 할당
                                // deadline: todo.deadline
                            });
                        }

                        else {
                            count += 1
                            console.log("update check 2222222222");

                            await this.todosRepository.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                                // startTime는 변경하지 않음
                                // deadline: todo.deadline
                            });
                            // return { message: `Todos updated successfully ${count}` };
                        }
                    } else {
                        console.log(`ID '${id}'에 해당하는 Todo를 찾을 수 없습니다. ${count}`);
                        await this.todosRepository.save({
                            manager: manager,
                            task: todo.task,
                            status: todo.READY
                        });
                        return { message: 'New Todo created successfully' };
                    }
                } else {
                    console.log(`ID가 없습니다.`);
                }
            } else {
                console.log(`유저 이메일 '${todo.email}'을(를) 찾을 수 없습니다.`);
            }
        }
        return { message: `Todos updated successfully ${count}` };

    }


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

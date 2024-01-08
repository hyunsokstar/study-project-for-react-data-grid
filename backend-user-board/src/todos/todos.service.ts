// TodosService.ts
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
            // console.log("task check : ", task);
            console.log("todo.email : ", todo.email);

            const startedAt = new Date(todo.startTime).getTime();
            const currentDeadline = new Date().getTime();
            console.log("currentDeadline : ", currentDeadline);
            console.log("startedAt : ", startedAt);
            const timeDifferenceInMilliseconds = currentDeadline - startedAt;
            // const timeDifferenceAsTimestamp = new Date(timeDifferenceInMilliseconds).toISOString();

            const hoursDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60)); // 시간
            const minutesDifference = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 분


            // 이메일로 해당하는 유저를 찾음
            const manager = await this.usersRepository.findOne({ where: { email: todo.email } });
            console.log("manager : ", manager);

            if (!manager) {
                throw new NotFoundException('User not found email is required !!');
            }

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
                                startTime: new Date,
                                // deadline: null,
                                elapsedTime: null,
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
                                    // deadline: null,
                                    elapsedTime: null,
                                });
                            } else {
                                await this.todosRepository.update(id, {
                                    manager: manager, // 찾은 유저 객체를 할당
                                    task: todo.task,
                                    status: todo.status,
                                    deadline: null,
                                    elapsedTime: null,
                                });
                            }
                        }
                        else if (todo.status === "testing") {
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                deadline: null,
                                elapsedTime: null,
                            });
                        }

                        else if (todo.status === "complete") {
                            await this.todosRepository.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                                // deadline: new Date(),
                                elapsedTime: hoursDifference + "시간 " + minutesDifference + "분",
                            });
                        }

                        else {
                            count += 1
                            console.log("update check 2222222222");

                            await this.todosRepository.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                            });
                        }
                    } else {
                        console.log(`ID '${id}'에 해당하는 Todo를 찾을 수 없습니다. ${count}`);
                        console.log("todo : ", todo);

                        await this.todosRepository.save({
                            manager: manager,
                            task: todo.task,
                            status: todo.READY,
                            startTime: new Date(),
                            deadline: todo.deadline
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
        {
            todoList: TodosModel[],
            totalCount: number,
            perPage: number, usersEmailInfo: string[]
        }
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

    // deleteTodosForCheckedIds
    // async deleteTodosForCheckedIds(checkedIds: number[], loginUser): Promise<any> {
    //     // todo checkedIds 에 들어 있는 id 들에 대해 삭제 하되
    //     // manager.email = loginUser.email 이 아닌 경우 
    //     // 에러 발생 ("todo 작성장인 manager.email 님만 삭제할 수 있습니다")
    //     try {
    //         const deleteResult = await this.todosRepository.delete(checkedIds);

    //         if (deleteResult.affected === 0) {
    //             throw new NotFoundException('삭제할 Todo를 찾을 수 없습니다.');
    //         }

    //         return { message: `Todo 삭제 완료: ${deleteResult.affected}개의 Todo가 삭제되었습니다.` };
    //     } catch (error) {
    //         throw new Error(`Todo 삭제 중 오류 발생: ${error.message}`);
    //     }
    // }
    async deleteTodosForCheckedIds(checkedIds: number[], loginUser): Promise<any> {
        try {
            // 삭제할 Todo들을 조회합니다.
            // const todosToDelete = await this.todosRepository.findByIds(checkedIds);
            const todosToDelete = await this.todosRepository.find({
                where: { id: In(checkedIds) }, // In 연산자를 사용하여 checkedIds에 해당하는 Todo를 검색합니다.
                relations: ['manager'], // manager와의 관계를 로드합니다.
            });

            // todosToDelete 배열에 있는 각 Todo의 manager 이메일과 loginUser의 이메일을 비교하여 권한을 확인합니다.
            for (const todo of todosToDelete) {
                if (todo.manager.email !== loginUser.email) {
                    console.log("이메일 안맞아서 삭제 안함");

                    throw new ForbiddenException('Todo 작성자만 삭제할 수 있습니다.');
                }
            }

            // 삭제 권한이 있는 경우에만 Todo를 삭제합니다.
            const deleteResult = await this.todosRepository.delete(checkedIds);

            if (deleteResult.affected === 0) {
                throw new NotFoundException('삭제할 Todo를 찾을 수 없습니다.');
            }

            return { message: `Todo 삭제 완료: ${deleteResult.affected}개의 Todo가 삭제되었습니다.` };
        } catch (error) {

            throw new ForbiddenException(`${error.message}`);
        }
    }

}

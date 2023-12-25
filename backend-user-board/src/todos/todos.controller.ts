// TodosController.ts
import { Controller, Post, Body, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { DtoForCreateTodo } from './dtos/createTodo.dto';
import { TodosModel } from './entities/todos.entity';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Post()
    async createTodo(@Body() createTodoDto: DtoForCreateTodo) {
        return this.todosService.create(createTodoDto);
    }

    @Get('')
    async getTodosWithManagers(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {

        return this.todosService.getTodosList(pageNum, perPage);
    }

}

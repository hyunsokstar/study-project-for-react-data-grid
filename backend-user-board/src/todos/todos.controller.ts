// TodosController.ts
import { Controller, Post, Body, Get, Query, Delete, UseGuards, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { DtoForCreateTodo } from './dtos/createTodo.dto';
import { TodosModel } from './entities/todos.entity';
import { AuthGuard } from 'src/guards/auth.guard';

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

    @Post('saveTodos') // API 엔드포인트 추가
    async saveTodos(@Body() todoRowsForSave: any) {
        console.log("todoRowsForSave at controller : ", todoRowsForSave);
        return this.todosService.saveTodos(todoRowsForSave);
    }

    @UseGuards(AuthGuard)
    @Delete("/deleteTodosForCheckedRows") // DELETE 메서드로 새로운 엔드포인트를 정의합니다.
    deleteTodosForCheckedIds(
        @Body('checkedIds') checkedIds: number[],
        @Req() req: Request,
    ) {
        const loginUser = req['user'];
        return this.todosService.deleteTodosForCheckedIds(checkedIds, loginUser);
    }

}

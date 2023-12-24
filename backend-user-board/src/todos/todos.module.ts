import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModel } from './entities/todos.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodosModel, UsersModel])
  ],
  controllers: [TodosController],
  providers: [TodosService]
})

export class TodosModule { }

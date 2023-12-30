import { Module } from '@nestjs/common';
import { TechnotesController } from './technotes.controller';
import { TechnotesService } from './technotes.service';
import { TechNotesModel } from './entities/technotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechNotesModel, UsersModel])
  ],
  controllers: [TechnotesController],
  providers: [TechnotesService]
})
export class TechnotesModule { }



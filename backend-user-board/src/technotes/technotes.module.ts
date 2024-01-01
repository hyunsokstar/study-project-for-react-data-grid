import { Module } from '@nestjs/common';
import { TechnotesController } from './technotes.controller';
import { TechnotesService } from './technotes.service';
import { TechNotesModel } from './entities/technotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from './entities/skilnotes.entity';
import { SkilnotesController } from './skilnotes/skilnotes.controller';
import { SkilnotesService } from './skilnotes/skilnotes.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([TechNotesModel, UsersModel, SkilNotesModel])
  ],
  controllers: [TechnotesController, SkilnotesController],
  providers: [TechnotesService, SkilnotesService]
})


export class TechnotesModule { }

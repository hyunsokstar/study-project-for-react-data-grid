import { Module } from '@nestjs/common';
import { TechnotesController } from './technotes.controller';
import { TechnotesService } from './technotes.service';
import { TechNotesModel } from './entities/technotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from './entities/skilnotes.entity';
import { SkilnotesController } from './skilnotes/skilnotes.controller';
import { SkilnotesService } from './skilnotes/skilnotes.service';
import { SkilNoteContentsModel } from './entities/skilnote_contents.entity';
import { AuthGuard } from 'src/guards/auth.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([TechNotesModel, UsersModel, SkilNotesModel, SkilNoteContentsModel])
  ],
  controllers: [TechnotesController, SkilnotesController],
  providers: [TechnotesService, SkilnotesService, AuthGuard]
})


export class TechnotesModule { }

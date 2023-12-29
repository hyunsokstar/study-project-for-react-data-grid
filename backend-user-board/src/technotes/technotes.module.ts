import { Module } from '@nestjs/common';
import { TechnotesController } from './technotes.controller';
import { TechnotesService } from './technotes.service';
import { TechNotesModel } from './entities/technotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechNotesModel])
  ],
  controllers: [TechnotesController],
  providers: [TechnotesService]
})
export class TechnotesModule { }

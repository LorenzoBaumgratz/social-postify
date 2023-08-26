import { Module, forwardRef } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule,forwardRef(()=>PublicationsModule)],
  controllers: [MediasController],
  providers: [MediasService,MediasRepository],
  exports:[MediasRepository]
})
export class MediasModule {}

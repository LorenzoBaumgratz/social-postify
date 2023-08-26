import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsRepository } from './publications.repository';
import { MediasModule } from '../medias/medias.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PrismaModule,forwardRef(()=>PostsModule) ,forwardRef(()=>MediasModule)],
  controllers: [PublicationsController],
  providers: [PublicationsService,PublicationsRepository],
  exports:[PublicationsRepository]
})
export class PublicationsModule {}

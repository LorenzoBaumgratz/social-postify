import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  
  constructor(private readonly prisma:PrismaService){}
}

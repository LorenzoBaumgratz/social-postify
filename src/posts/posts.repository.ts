import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma:PrismaService){}

  removePost(id: number) {
    return this.prisma.post.delete({
      where:{
        id
      }
    })
  }
  updatePost(id: number, updatePostDto: CreatePostDto) {
    return this.prisma.post.update({
      data:updatePostDto,
      where:{
        id
      }
    })
  }
  findPostById(id: number) {
    return this.prisma.post.findUnique({
      where:{
        id
      }
    })
  }
  findPosts() {
    return this.prisma.post.findMany()
  }
  createPost(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data:createPostDto
    })
  }
  
}

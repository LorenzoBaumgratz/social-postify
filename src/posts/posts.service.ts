import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {

  constructor (
    @Inject(forwardRef(()=> PublicationsRepository))
    private readonly publicationsRepository:PublicationsRepository,
    private readonly repository:PostsRepository
    ){}

  async create(createPostDto: CreatePostDto) {
    return await this.repository.createPost(createPostDto);
  }

  async findAll() {
    return await this.repository.findPosts();
  }

  async findOne(id: number) {
    const post=await this.repository.findPostById(id);
    if(!post) throw new NotFoundException()
    return post
  }

  async update(id: number, updatePostDto: CreatePostDto) {
    const post=await this.repository.findPostById(id);
    if(!post) throw new NotFoundException()
    return await this.repository.updatePost(id,updatePostDto);
  }

  async remove(id: number) {
    const post=await this.repository.findPostById(id);
    if(!post) throw new NotFoundException()

    //FAZ PARTE DE ALGUMA PUBLICAÇÃO??????? --->403
    const publication=await this.publicationsRepository.findByMediaId(id)
    if(publication) throw new ForbiddenException()
    return await this.repository.removePost(id);
  }
}

import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';

@Injectable()
export class PublicationsService {
  constructor (
    private readonly repository:PublicationsRepository,
    @Inject(forwardRef(()=> PostsRepository))
    private readonly postsRepository:PostsRepository,
    @Inject(forwardRef(()=> MediasRepository))
    private readonly mediasRepository:MediasRepository,
    ){}
  async create(createPublicationDto: CreatePublicationDto) {
    const mediaId=await this.mediasRepository.findMediaById(createPublicationDto.mediaId)
    const postId=await this.postsRepository.findPostById(createPublicationDto.postId)
    if(!mediaId || !postId) throw new NotFoundException()
    return await this.repository.createPublication(createPublicationDto)
  }

  async findAll(after?:Date,published?:boolean) {
    if(after) return await this.repository.isAfter(after)
    if(published!==undefined) return await this.repository.isPublished(published)

    return await this.repository.findPublications()
  }

  async findOne(id: number) {
    const publication=await this.repository.findPublicationById(id)
    if(!publication) throw new NotFoundException()
    return publication
  }

  async update(id: number, updatePublicationDto: CreatePublicationDto) {
    const publication=await this.repository.findPublicationById(id)
    if(!publication) throw new NotFoundException()
    
    //verificar se esta agendada ou ja foi publicada
    if(publication.date<new Date()) throw new ForbiddenException()

    //existem registros compativeis
    const mediaId=await this.mediasRepository.findMediaById(updatePublicationDto.mediaId)
    const postId=await this.postsRepository.findPostById(updatePublicationDto.postId)
    if(!mediaId || !postId) throw new NotFoundException()
    return await this.repository.updatePublication(id,updatePublicationDto)
  }

  async remove(id: number) {

    const publication=await this.repository.findPublicationById(id)
    if(!publication) throw new NotFoundException()

    return await this.repository.deletePublication(id)
  }
}

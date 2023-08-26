import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {

  constructor (
    private readonly repository:MediasRepository,
    @Inject(forwardRef(()=> PublicationsRepository))
    private readonly publicationRepository:PublicationsRepository,
    ){}

  async create(createMediaDto: CreateMediaDto) {
    const media=await this.repository.findMediaByUsernameAndTitle(createMediaDto)
    if(media.length!==0) throw new ConflictException()
    return await this.repository.createMedia(createMediaDto);
  }

  async findAll() {
    return await this.repository.findAllMedia()
  }

  async findOne(id: number) {
    const media=await this.repository.findMediaById(id)
    if(!media) throw new NotFoundException()
    return media
  }

  async update(id: number, updateMediaDto: CreateMediaDto) {
    const mediaById=await this.repository.findMediaById(id)
    if(!mediaById) throw new NotFoundException()

    const media=await this.repository.findMediaByUsernameAndTitle(updateMediaDto)
    if(media.length!==0) throw new ConflictException()

    return await this.repository.updateMidia(id,updateMediaDto)
  }

  async remove(id: number) {
    const mediaById=await this.repository.findMediaById(id)
    if(!mediaById) throw new NotFoundException()

    //FAZ PARTE DE ALGUMA PUBLICAÇÃO??????? --->403
    const publication=await this.publicationRepository.findByMediaId(id)
    if(publication) throw new ForbiddenException()
    
    return await this.repository.deleteMidia(id)
  }
}

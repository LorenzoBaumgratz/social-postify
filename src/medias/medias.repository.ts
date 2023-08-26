import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
// import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma:PrismaService){}

  updateMidia(id: number, updateMediaDto: CreateMediaDto) {
    return this.prisma.media.update({
      data:updateMediaDto,
      where:{
        id
      }
    })
  }
  deleteMidia(id: number) {
    return this.prisma.media.delete({
      where:{
        id
      }
    })
  }
  
  findMediaById(id: number) {
    return this.prisma.media.findUnique({
      where:{
        id
      }
    })
  }

  findMediaByUsernameAndTitle(createMediaDto: CreateMediaDto) {
    return this.prisma.media.findMany({
      where:{
        title:createMediaDto.title,
        username:createMediaDto.username
      }
    })
  }

  findAllMedia() {
    return this.prisma.media.findMany()
  }
  
  createMedia(createMediaDto: CreateMediaDto) {
    return this.prisma.media.create({
      data:createMediaDto
    })
  }
}

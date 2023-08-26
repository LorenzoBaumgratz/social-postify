import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma:PrismaService){}

  deletePublication(id: number) {
    return this.prisma.publication.delete({
      where:{
        id
      }
    })
  }
  updatePublication(id: number, updatePublicationDto: CreatePublicationDto) {
    return this.prisma.publication.update({
      data:updatePublicationDto,
      where:{
        id
      }
    })
  }
  findPublicationById(id: number) {
    return this.prisma.publication.findUnique({
      where:{
        id
      }
    })
  }
  findPublications() {
    return this.prisma.publication.findMany()
  }
  createPublication(createPublicationDto: CreatePublicationDto) {
    return this.prisma.publication.create({
      data:createPublicationDto
    })
  }

  findByMediaId(id:number){
    return this.prisma.publication.findFirst({
      where:{
        mediaId:id
      }
    })
  }

  findByPostId(id:number){
    return this.prisma.publication.findFirst({
      where:{
        postId:id
      }
    })
  }
  isPublished(published:boolean){
    if(published){
      return this.prisma.publication.findMany({
        where:{
            date:{
              gte:new Date()
            }
        }
      })
    }else{
      return this.prisma.publication.findMany({
        where:{
            date:{
              lte:new Date()
            }
        }
      })
    }
  }

  isAfter(date:Date){
    return this.prisma.publication.findMany({
      where:{
        date:{
          gte:date
        }
      }
    })
  }
}

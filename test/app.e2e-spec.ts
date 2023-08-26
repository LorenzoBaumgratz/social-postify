import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    prisma=app.get(PrismaService)

    await prisma.publication.deleteMany()
    await prisma.post.deleteMany()
    await prisma.media.deleteMany()

    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect("I'm okay!");
  });

  it('/medias (POST) OK', async() => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title:"Instagram",
        username:"Lorenzo"
      })
      .expect(HttpStatus.CREATED)

    const media=await prisma.media.findMany()
    expect(media).toHaveLength(1)
    expect(media[0]).toEqual({
      id:expect.any(Number),
      title:"Instagram",
      username:"Lorenzo"
    })
  });

  it('/medias (GET) OK', async() => {
    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    const media=await request(app.getHttpServer())
      .get('/medias')
      .expect(200)
    
      expect(media.body).toHaveLength(1)
      expect(media.body[0]).toEqual(
        {
        id:mediaCreate.id,
        title:mediaCreate.title,
        username:mediaCreate.username
      })
  });

  it('/medias/:id (GET) OK', async() => {
    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    const media=await request(app.getHttpServer())
      .get(`/medias/${mediaCreate.id}`)
      .expect(200)
    
      
      expect(media.body).toEqual({
        id:mediaCreate.id,
        title:mediaCreate.title,
        username:mediaCreate.username
      })
  });

  it('/medias/:id (PUT) OK', async() => {
    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    const media=await request(app.getHttpServer())
      .put(`/medias/${mediaCreate.id}`)
      .send({
        title:"Twitter",
        username:"LBZAO"
      })
      .expect(200)
    
      
      expect(media.body).toEqual(expect.objectContaining({
        id:expect.any(Number),
        title:"Twitter",
        username:"LBZAO"
      }))
  });

  it('/medias/:id (DELETE) OK', async() => {
    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    await request(app.getHttpServer())
      .delete(`/medias/${mediaCreate.id}`)
      .expect(200)
    
      
    const media=await prisma.media.findMany()
    expect(media).toHaveLength(0)
  });
  
  it('/posts (POST) OK', async() => {
    
    await request(app.getHttpServer())
      .post(`/posts`)
      .send({
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/",
      })
      .expect(201)
    
    const posts=await prisma.post.findMany()
    
    expect(posts).toHaveLength(1)
    expect(posts[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      title:"alguma coisa ai",
      text:"https://blog.counter-strike.net/index.php/category/updates/"
    }))
  });

  it('/posts (GET) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    await request(app.getHttpServer())
      .get(`/posts`)
      .expect(200)
    
    const posts=await prisma.post.findMany() 
    expect(posts).toHaveLength(1)
    expect(posts[0]).toEqual(expect.objectContaining({
      id:postCreate.id,
      title:"alguma coisa ai",
      text:"https://blog.counter-strike.net/index.php/category/updates/"
    }))
  });

  it('/posts:id (GET) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const posts=await request(app.getHttpServer())
      .get(`/posts/${postCreate.id}`)
      .expect(200)
    
      
    expect(posts.body).toEqual(expect.objectContaining({
      id:postCreate.id,
      title:postCreate.title,
      text:postCreate.text
    }))
  });

  it('/posts/:id (PUT) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const post=await request(app.getHttpServer())
      .put(`/posts/${postCreate.id}`)
      .send({
        title:"something",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      })
      .expect(200)
    
      
      expect(post.body).toEqual(expect.objectContaining({
        id:postCreate.id,
        title:"something",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }))
  });

  it('/posts/:id (DELETE) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"something",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    await request(app.getHttpServer())
      .delete(`/posts/${postCreate.id}`)
      .expect(200)
    
      
    const post=await prisma.post.findMany()
    expect(post).toHaveLength(0)
  });

  it('/publications (POST) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    await request(app.getHttpServer())
      .post(`/publications`)
      .send({
        mediaId:mediaCreate.id,
        postId:postCreate.id,
        date:new Date(),
      })
      .expect(201)
    
    const publications=await prisma.publication.findMany()
    
    expect(publications).toHaveLength(1)
    expect(publications[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      mediaId:mediaCreate.id,
      postId:postCreate.id,
      date:expect.any(Date),
    }))
  });

  it('/publications (GET) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })
    
    const publicationCreate=await prisma.publication.create({
      data:{
        mediaId:mediaCreate.id,
        postId:postCreate.id,
        date:new Date(),
      }
    })

    const publications=await request(app.getHttpServer())
      .get(`/publications`)
      .expect(200)
    
    expect(publications.body).toHaveLength(1)
    expect(publications.body[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      mediaId:mediaCreate.id,
      postId:postCreate.id,
      date:expect.any(String),
    }))
  });

  it('/publications:id (GET) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })

    const publicationCreate=await prisma.publication.create({
      data:{
        mediaId:mediaCreate.id,
        postId:postCreate.id,
        date:new Date(),
      }
    })

    const publications=await request(app.getHttpServer())
      .get(`/publications/${publicationCreate.id}`)
      .expect(200)
    
      
    expect(publications.body).toEqual(expect.objectContaining({
      id:expect.any(Number),
      mediaId:mediaCreate.id,
      postId:postCreate.id,
      date:expect.any(String),
    }))
  });

  it('/publications/:id (PUT) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })
    let data=new Date()
    data.setDate(data.getDate()+1)
    const publicationCreate=await prisma.publication.create({
      data:{
        mediaId:mediaCreate.id,
        postId:postCreate.id,
        date:data,
      }
    })

    const mediaCreate2=await prisma.media.create({
      data:{
        title:"Twitter",
        username:"LBZAO"
      }
    })

    const publication=await request(app.getHttpServer())
      .put(`/publications/${publicationCreate.id}`)
      .send({
        mediaId:mediaCreate2.id,
        postId:postCreate.id,
        date:new Date(),
      })
      .expect(200)
    
      
      expect(publication.body).toEqual(expect.objectContaining({
        id:expect.any(Number),
        mediaId:mediaCreate2.id,
        postId:postCreate.id,
        date:expect.any(String),
      }))
  });

  it('/publications/:id (DELETE) OK', async() => {
    const postCreate=await prisma.post.create({
      data:{
        title:"alguma coisa ai",
        text:"https://blog.counter-strike.net/index.php/category/updates/"
      }
    })

    const mediaCreate=await prisma.media.create({
      data:{
        title:"Instagram",
        username:"Lorenzo"
      }
    })
    
    const publicationCreate=await prisma.publication.create({
      data:{
        mediaId:mediaCreate.id,
        postId:postCreate.id,
        date:new Date(),
      }
    })

    await request(app.getHttpServer())
      .delete(`/publications/${publicationCreate.id}`)
      .expect(200)
    
      
    const publication=await prisma.publication.findMany()
    expect(publication).toHaveLength(0)
  });
});

import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class CreatePostDto{
    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    text:string

    @IsString()
    @IsUrl()
    image:string
}
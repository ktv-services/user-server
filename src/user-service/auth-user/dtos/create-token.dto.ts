import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
    _id?: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsString()
    @IsNotEmpty()
    status: string;
}

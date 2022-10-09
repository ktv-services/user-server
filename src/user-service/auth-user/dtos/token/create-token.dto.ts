import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsString()
    @IsNotEmpty()
    status: string;
}

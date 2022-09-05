import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
    constructor(private readonly authService: RoleService) {}

    @Get('auth')
    getHello(): string {
        return ''
    }
}

import { RoleInterface } from '../../role/interfaces/role.interface';
import { TokenInterface } from './token.interface';
import { SocialUserInterface } from './social-user.interface';

export interface UserInterface {
    email: string;
    password: string;
    wrong: number;
    type: string;
    blockTime: Date;
    status: string;
    role: RoleInterface;
    token: TokenInterface;
    socials: SocialUserInterface[];
    created: Date;
    updated: Date;
}

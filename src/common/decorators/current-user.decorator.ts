import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  sub: number;
  email: string;
  role: string;
  picture: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

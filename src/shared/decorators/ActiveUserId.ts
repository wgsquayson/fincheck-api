import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const ActiveUserId = createParamDecorator<never>(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const userId = request.userId;

    if (!userId) throw new UnauthorizedException();

    return userId;
  },
);

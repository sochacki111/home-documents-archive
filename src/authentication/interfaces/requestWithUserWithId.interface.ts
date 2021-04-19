import { Request } from 'express';
import { UserWithId } from './userWithId.interface';

interface RequestWithUser extends Request {
  user: UserWithId;
}

export default RequestWithUser;

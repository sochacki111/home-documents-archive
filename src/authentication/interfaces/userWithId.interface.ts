import * as mongoose from 'mongoose';

export interface UserWithId {
  _id: mongoose.Schema.Types.ObjectId;

  email: string;

  name: string;

  password: string;
}

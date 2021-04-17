import * as mongoose from 'mongoose';

interface TokenPayload {
  userId: mongoose.Schema.Types.ObjectId;
}

export default TokenPayload;

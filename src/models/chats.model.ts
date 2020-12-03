// chats-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'chats';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      clientId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      operatorId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      lastMessageId: {
        type: Schema.Types.ObjectId,
        ref: 'messages',
        required: false,
      },
      lastMessageDate: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}

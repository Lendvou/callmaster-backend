// messages-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'messages';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      text: { type: String },
      type: { type: String, enum: ['text', 'photo', 'call'], required: true },
      isRead: { type: Boolean, default: false },
      authorRole: { type: String, enum: ['admin', 'operator', 'client'] },
      photosIds: { type: [Schema.Types.ObjectId], ref: 'uploads' },
      chatId: {
        type: Schema.Types.ObjectId,
        ref: 'chats',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
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

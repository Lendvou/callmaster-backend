// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose, Schema } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema = new mongooseClient.Schema(
    {
      email: { type: String, unique: true, lowercase: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['admin', 'operator', 'client'] },
      name: {
        firstName: { type: String },
        lastName: { type: String },
      },
      isOnline: { type: Boolean, default: false },
      avatarId: {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
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

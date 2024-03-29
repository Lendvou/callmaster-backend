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
      firstName: { type: String },
      lastName: { type: String },
      email: {
        type: String,
        lowercase: true,
        unique: true,
      },
      password: { type: String },
      role: {
        type: String,
        enum: ['admin', 'operator', 'client'],
        required: true,
      },
      isOnline: { type: Boolean, default: false },
      isBusy: { type: Boolean, default: false },
      avatarId: {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
      },
      secret: { type: String },
      num: { type: Number, default: 0 },
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

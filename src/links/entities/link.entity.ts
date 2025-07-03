import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Link extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ default: true })
  valid: boolean;

  @Prop()
  password?: string;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: 0 })
  redirectCount: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LinkSchema = SchemaFactory.createForClass(Link);

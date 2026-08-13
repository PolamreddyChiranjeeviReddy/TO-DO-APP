import mongoose, { Schema, Document } from 'mongoose';

export const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type Priority = (typeof PRIORITY_VALUES)[number];

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: Priority;
  category: string;
  tags: string[];
  completed: boolean;
  completedAt: Date | null;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dateTime: {
      type: Date,
    },
    deadline: {
      type: Date,
      validate: {
        validator: (value: Date) => !Number.isNaN(value.getTime()),
        message: 'Deadline must be a valid date',
      },
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITY_VALUES,
        message: 'Priority must be one of: LOW, MEDIUM, HIGH',
      },
      default: 'MEDIUM',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);

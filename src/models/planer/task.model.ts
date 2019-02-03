import { Document, model, Model, Schema } from 'mongoose';

import { IUser } from '../user.model';
import { ICategory } from './category.model';

const taskSchema = new Schema({
    name: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    color: String,
    status: Boolean,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    points: {
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
    },
    time: {
        activated: Date,
        timeout: Number,
        unit: {
            type: Number,
            min: 0,
            max: 3,
            get: (v: number) => Math.round(v),
            set: (v: number) => Math.round(v),
        },
    },
    children: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    lastCompleted: Date,
    lastCompletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

// DONT use arrow functions here
// Arrow functions bind this and prevent you from accessing the document
// tslint:disable-next-line:only-arrow-functions

export default model('Task', taskSchema) as Model<ITask, {}>;
export interface ITask extends Document {
    name: string;
    description: string;
    owner: IUser;
    color: string;
    status: boolean;
    users: IUser[];
    categories: ICategory[];
    group: IUser;
    points: number;
    time: { activated: Date, timeout: number, unit: number };
    lastCompleted: Date;
    lastCompletedBy: IUser;
    children: ITask[];
}

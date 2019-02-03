import { Document, model, Model, Schema } from 'mongoose';

import { IUser } from '../user.model';
import { ITask } from './task.model';

const triggerSchema = new Schema({
    name: {
        index: true,
        type: String,
        unique: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    webTrigger: {
        active: Boolean,
        acceptUserArgument: Boolean,
        allowUserReplacement: Boolean,
        allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    timeTrigger: {
        active: Boolean,
        intervall: Number,
        unit: {
            type: Number,
            min: 0,
            max: 3,
            get: (v: number) => Math.round(v),
            set: (v: number) => Math.round(v),
        },
        lastRun: Date,
    },
    distribution: Number,
});

// DONT use arrow functions here
// Arrow functions bind this and prevent you from accessing the document
// tslint:disable-next-line:only-arrow-functions

export default model('Trigger', triggerSchema) as Model<ITrigger, {}>;
export interface ITrigger extends Document {
    name: string;
    owner: IUser;
    tasks: ITask[];
    webTrigger: {
        active: boolean;
        acceptUserArgument: boolean;
        allowUserReplacement: boolean;
        allowedUsers: IUser[];
    };
    timeTrigger: {
        active: boolean;
        intervall: number;
        unit: string;
        lastRun: Date;
    };
    distribution: IUser[];
}

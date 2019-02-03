import { Document, model, Model, Schema } from 'mongoose';
import { IUser } from './user.model';

const groupSchema = new Schema({
    name: {
        index: true,
        type: String,
        unique: true,
    },
    description: String,
    login: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// DONT use arrow functions here
// Arrow functions bind this and prevent you from accessing the document
// tslint:disable-next-line:only-arrow-functions
groupSchema.statics.getGroup = function(user: IUser) {
    return this.findOne({ login: user });
};

export default model('Group', groupSchema) as IGroupModel;
export interface IGroup extends Document {
    name: string;
    description: string;
    login: IUser;
    users: IUser[];
}
interface IGroupModel extends Model<IGroup, {}> {
    getGroup: (user: IUser) => Promise<IGroup>;
}

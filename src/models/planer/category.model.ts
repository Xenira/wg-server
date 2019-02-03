import { Document, model, Model, Schema } from 'mongoose';

import { IUser } from '../user.model';

const categorySchema = new Schema({
    name: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    color: String,
});

// DONT use arrow functions here
// Arrow functions bind this and prevent you from accessing the document
// tslint:disable-next-line:only-arrow-functions

export default model('Category', categorySchema) as Model<ICategory, {}>;
export interface ICategory extends Document {
    name: string;
    description: string;
    owner: IUser;
    color: string;
}

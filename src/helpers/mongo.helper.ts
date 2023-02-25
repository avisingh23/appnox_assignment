import mongoose, { ObjectId } from 'mongoose';

export class MongoHelper {
    static createObjectId() {
        return new mongoose.Types.ObjectId();
    }

    static isObjectId(id: any) {
        return id instanceof mongoose.Types.ObjectId;
    }

    static toObjectId(id: string) {
        return new mongoose.Types.ObjectId(id);
    }

    static areIdsEqual(first: ObjectId | string, second: ObjectId | string) {
        return first.toString() === second.toString();
    }
}

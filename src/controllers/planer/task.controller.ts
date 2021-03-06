import { NextFunction, Request, Response } from 'express';
import { body, param } from 'express-validator/check';

import HttpError from '../../config/error';
import validation, { validateArrayElements } from '../../config/validation';
import groupModel from '../../models/group.model';
import taskModel, { ITask } from '../../models/planer/task.model';
import userModel from '../../models/user.model';

export const getUserTasks = (req: Request, res: Response) => {
    const results: ITask[] = [];
    const promisses = [taskModel.find({ owner: req.user }).then((tasks) => results.push(...tasks))];
    groupModel.find({ users: { $in: [req.user] } }).then((groups) => {
        promisses.push(...groups.map((group) => {
            return taskModel.find({ owner: group.login }).then((tasks) => results.push(...tasks));
        }));
    }).then(() => Promise.all(promisses))
        .then(() => res.json(results.filter((t, i) => results.indexOf(t) === i)));
};

export const createTask = [
    body('owner').optional().isAlphanumeric(),
    body('color').isHexColor(),
    body(['points', 'timeout']).isInt(),
    body('unit').isInt({ min: 0, max: 3 }),
    body(['name', 'description']).optional().isAscii().trim(),
    body('users').optional().isArray()
        .custom(validateArrayElements({ isAlphanumeric: true })),
    body(['categories', 'parents', 'children']).optional().isArray()
        .custom(validateArrayElements({ isMongoId: true })),
    validation,
    (req: Request, res: Response, next: NextFunction) => {
        const task = new taskModel({
            name: req.body.name,
            color: req.body.color,
            points: req.body.points,
            time: {
                timeout: req.body.timeout,
                unit: req.body.unit,
                activated: null,
            },
            description: req.body.description,
            status: false,
            owner: req.user,
            users: [],
            categories: req.body.categories,
            children: req.body.children,
        }) as ITask;

        const promises: Array<Promise<any>> = [];

        if (req.body.owner) {
            promises.push(groupModel.getGroup(req.user).then((group) => {
                if (group && group.login.name === req.body.owner) {
                    task.owner = group.login;
                    return Promise.resolve();
                }
                return Promise.reject(new HttpError(400, 'Invalid User'));
            }));
        }

        if (req.body.users) {
            promises.push(...req.body.users.map((userName: string) => {
                return userModel.findOne({ name: userName }).then((user) => {
                    if (!user) {
                        return Promise.reject();
                    }
                    task.users.push(user);
                    return Promise.resolve();
                });
            }));
        }

        // Check if all parents are present
        if (req.body.parents) {
            promises.push(...req.body.parents.map((parentId: string) => taskModel.findById(parentId)));
        }

        Promise.all(promises).then(() => task.save()).then((newTask) => {
            if (req.body.parents) {
                return Promise.all(req.body.parents.map((parentId: string) =>
                    taskModel.findByIdAndUpdate(parentId, { children: { $push: newTask } }))).then(() => newTask);
            }
            return Promise.resolve(newTask);
        }).then((newTask) => res.json(newTask)).catch((err) => next(err));
    },
];

export const deleteTask = [
    param('id').isMongoId(),
    (req: Request, res: Response, next: NextFunction) => {
        taskModel.findOneAndDelete({_id: req.params.id, owner: req.user })
            .then((deletedItem) => {
                if (deletedItem) {
                    return res.sendStatus(204);
                }
                next(new HttpError(404, 'Task not found or insufficiant permissions.'));
            }).catch((reason) => {
                next(new HttpError(500, reason));
            });
    },
];

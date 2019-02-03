import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator/check';

import HttpError from '../../config/error';
import validation, { validateArrayElements } from '../../config/validation';
import groupModel from '../../models/group.model';
import taskModel, { ITask } from '../../models/planer/task.model';
import userModel from '../../models/user.model';

export const getUserTasks = (req: Request, res: Response) => {
    const tasks: ITask[] = [];
    groupModel.find({ login: req.user }, (err, groups) => {
        if (!err) {
            groups.forEach((g) => taskModel.find({ group: g }, (taskErr, groupTasks) => {
                if (!taskErr) {
                    tasks.push(...groupTasks);
                }
            }));
        }
    });

    taskModel.find({ users: { $in: req.user } }, (err, userTasks) => {
        if (!err) {
            tasks.push(...userTasks);
        }
    });

    res.json(tasks.filter((t, i) => tasks.indexOf(t) > i));
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

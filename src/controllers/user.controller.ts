import { Request, Response } from 'express';
import { body } from 'express-validator/check';

import validation from '../config/validation';
import User, { IUser } from '../models/user.model';

// PUT: /register
export const register = [
    body('username').trim()
        .isAlphanumeric(),
    body('password').isLength({ min: 8 }),
    validation,
    (req: Request, res: Response) => {
        console.log('register', req.body.username, req.body.password);
        const user = new User() as IUser;
        user.name = req.body.username;
        user.setPassword(req.body.password, () => {
            user.save((err, savedUser) => {
                if (err) {
                    return res.sendStatus(500);
                }
                req.login(savedUser, (loginErr) => {
                    if (loginErr) {
                        return res.sendStatus(500);
                    }
                    return res.sendStatus(204);
                });
            });
        });
    },
];

export const getCurrentUser = [
    (req: Request, res: Response) => {
        res.json({ name: req.user.name });
    },
];

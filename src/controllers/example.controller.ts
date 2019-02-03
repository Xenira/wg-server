import { NextFunction, Request, Response } from 'express';

// GET: path/
export const getFunction = (req: Request, res: Response, next: NextFunction) => {
   return res.sendStatus(418);
};

// POST: path/
export const postFunction = (req: Request, res: Response, next: NextFunction) => {
   return res.sendStatus(418);
};

// PUT: path/
export const putFunction = (req: Request, res: Response, next: NextFunction) => {
   return res.sendStatus(418);
};

// DELETE: path/
export const deleteFunction = (req: Request, res: Response, next: NextFunction) => {
   return res.sendStatus(418);
};

import { Request, Response } from "express";

export function index (request: Request, response: Response) {
    console.log(request.host);
    console.log(request.method);

    response.json({ 'message': 'ciao' });
};

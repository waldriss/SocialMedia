import { Request } from "express";

export interface RegisterRequest extends Request {
    body: {
        email: string;
        name: string;
        username:string;
        password:string;
    };
}


export interface SigInOrSignUpGoogleRequest extends Request {
    body: {
        email: string;
        name: string;
        userId:string;
    };
}



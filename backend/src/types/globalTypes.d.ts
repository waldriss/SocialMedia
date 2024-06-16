export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

export interface TAuth{
  sessionClaims:{
    userId:string;
  }


}


  declare global {
    namespace Express {
      interface Request {
        file: IFile;
        auth:TAuth;
        AuthentifiedUserId?:number

      }
    }
  }
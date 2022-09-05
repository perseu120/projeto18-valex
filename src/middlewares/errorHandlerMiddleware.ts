import { NextFunction, Request, Response } from "express";

export default function errorHandler (error: any, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  if (error.code === "NotFound") {
    return res.sendStatus(404);
  }
  else if (error.code === "Conflict") {
    return res.sendStatus(409);
  }
  else if (error.code === "BadRequest") {
    return res.sendStatus(400);
  } 
  else if (error.code === "Unauthorized") {
    return res.sendStatus(401);
  } 
  else if (error.code === "Expired") {
    return res.sendStatus(410);
  }

  res.sendStatus(500); // internal server error
}
import "express";

export type CustomerPayload = {
  id: number;
  role: "customer";
};

declare global {
  namespace Express {
    export interface Request {
      customer?: CustomerPayload;
    }
  }
}

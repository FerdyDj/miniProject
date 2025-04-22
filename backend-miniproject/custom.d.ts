import "express";

export type CustomerPayload = {
  id: number;
  role: string;
};

export type OrganizerPayload = {
  id: number;
  role: string;
};

declare global {
  namespace Express {
    export interface Request {
      customer?: CustomerPayload;
      organizer?: OrganizerPayload;
    }
  }
}

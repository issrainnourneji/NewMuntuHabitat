/* tslint:disable */
/* eslint-disable */
import { User } from '../models/user';
export interface Simulation {
  createdBy?: string;
  createdDate?: string;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  result?: number;
  selectedAnswers?: Array<number>;
  user?: User;
}

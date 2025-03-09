import { Prospect } from "./prospect";

export interface ProspectSelection {
  id: number;
  role: string;
  propertyType: string;
  workType: string;
  budget: string;
  user: Prospect;
}

import { Role } from "./role";
import { ProspectSelection } from "./selection";

export interface Prospect {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  accountLocked: boolean;
  enabled: boolean;
  createdAt: string; // Date formatée en string pour le stockage et l'affichage
  role: Role;     // Enumération pour les rôles
  prospectSelection?: ProspectSelection;
}

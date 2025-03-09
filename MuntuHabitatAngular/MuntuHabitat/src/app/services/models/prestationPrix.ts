import { Lot } from './lot';

export class PrestationPrix {
    id?: number;
    designation!: string;
    lot!: Lot;
    prixFourniture!: number;
    prixUnitaire!: number;
    unite!: string;
   
}

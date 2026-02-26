export enum StatutSante {
  Sain = 0,
  Lent = 1,
  EnPanne = 2,
  Injoignable = 3,
}

export interface Serveur {
  id: string;
  nom: string;
  adresseIp: string;
  urlSante: string;
  estActif: boolean;
  pourcentageUptime: number;
  dernierStatut: StatutSante;
  dernierTempsReponseMs: number;
  derniereVerification: Date;
}

export interface Verification {
  id: string;
  mesureLe: Date;
  tempsReponseMs: number;
  statut: StatutSante;
  details?: string;
}

export interface Incident {
  id: string;
  debutLe: Date;
  resoluLe?: Date;
  raison?: string;
}

export interface CreateServeur {
  nom: string;
  adresseIp: string;
  urlSante: string;
  apiKey?: string;
}

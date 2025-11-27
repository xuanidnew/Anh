export interface RawPayload {
  code: string;
  password?: string; // If empty, no password required
  timestamp: number;
}

export enum ViewMode {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
}

export interface DecodedData {
  isValid: boolean;
  payload?: RawPayload;
}

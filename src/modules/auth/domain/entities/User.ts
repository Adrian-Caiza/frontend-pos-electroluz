
export interface User {
  usid: string;
  usemid: string;
  usnombre: string;
  usapodo: string;
  uscorreo: string;
  usimagen?: string;
  usrol: string;
  usestado: string;
}

export interface Company {
  emid: string;
  emruc: string;
  emrznsocial: string;
  emlogo?: string;
  emestado: string;
  empadre: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  company: Company;
  user: User;
}

export enum RESOURCE {
  ADULTO = 'ADULTO',
  PROTAGONISTA = 'PROTAGONISTA',
  RESPONSABLE = 'RESPONSABLE',
  PAGO = 'PAGO',
  EVENTO = 'EVENTO',
  USER = 'USER',
}

export enum ACTION {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
}

export interface Permission {
  resource: RESOURCE;
  action: ACTION;
}

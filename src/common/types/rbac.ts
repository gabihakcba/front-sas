export enum RESOURCE {
  ADULTO = 'ADULTO',
  PROTAGONISTA = 'PROTAGONISTA',
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

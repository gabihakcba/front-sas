export interface PerfilResumen {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string | null;
  telefono: string | null;
  telefono_emergencia: string;
  totem: string | null;
  cualidad: string | null;
  Cuenta: {
    id: number;
    user: string;
  };
  Protagonista: {
    id: number;
    es_becado: boolean;
    activo: boolean;
  } | null;
  Adulto: {
    id: number;
    es_becado: boolean;
    activo: boolean;
  } | null;
  Responsable: {
    id: number;
  } | null;
}

export interface PerfilAsignacion {
  ramaActual: {
    fecha_ingreso: string;
    Rama: {
      id: number;
      nombre: string;
      Area: {
        id: number;
        nombre: string;
      };
    };
  } | null;
  asignacionAdulto: {
    fecha_inicio: string;
    Area: {
      id: number;
      nombre: string;
    };
    Rama: {
      id: number;
      nombre: string;
    } | null;
    Posicion: {
      id: number;
      nombre: string;
    };
  } | null;
  esProtagonista: boolean;
  esAdulto: boolean;
}

export interface PerfilActividad {
  InscripcionEvento: Array<{
    id: number;
    asistio: boolean;
    pagado: boolean;
    saldo_pendiente: string;
    monto_total: string;
    Evento: {
      id: number;
      nombre: string;
      fecha_inicio: string;
      fecha_fin: string;
      lugar: string | null;
      TipoEvento: {
        nombre: string;
      };
    };
  }>;
  ParticipantesComision: Array<{
    id: number;
    fecha_inicio: string;
    fecha_fin: string | null;
    Comision: {
      id: number;
      nombre: string;
      descripcion: string | null;
      Evento: {
        id: number;
        nombre: string;
        fecha_inicio: string;
      } | null;
    };
  }>;
}

export interface PerfilVinculos {
  responsables: Array<{
    id: number;
    Relacion: {
      id: number;
      tipo: string;
    };
    Responsable: {
      id: number;
      Miembro: {
        id: number;
        nombre: string;
        apellidos: string;
        dni: string;
        telefono: string | null;
        email: string | null;
      };
    };
  }>;
  protagonistas: Array<{
    id: number;
    Relacion: {
      id: number;
      tipo: string;
    };
    Protagonista: {
      id: number;
      Miembro: {
        id: number;
        nombre: string;
        apellidos: string;
        dni: string;
      };
      MiembroRama: Array<{
        Rama: {
          id: number;
          nombre: string;
        };
      }>;
    };
  }>;
}

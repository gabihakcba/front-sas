export interface PlanFormacionTemplateOption {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface PlanFormacionOptionsResponse {
  currentYear: number;
  templates: PlanFormacionTemplateOption[];
  apfAdults: Array<{
    id: number;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
    };
  }>;
}

export interface FormacionAdminWorkspace {
  canEdit: boolean;
  canCreatePlan: boolean;
  canManageApf: boolean;
  templates: PlanFormacionTemplateAdmin[];
  areas: Array<{
    id: number;
    nombre: string;
  }>;
  apfAssignments: Array<{
    id: number;
    fecha_inicio: string;
    observacion: string | null;
    Adulto: {
      id: number;
      Miembro: {
        id: number;
        nombre: string;
        apellidos: string;
      };
    };
    Consejo: {
      id: number;
      nombre: string;
      fecha: string;
    };
  }>;
  adults: Array<{
    id: number;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
    };
  }>;
  consejos: Array<{
    id: number;
    nombre: string;
    fecha: string;
  }>;
}

export interface PlanFormacionTemplateAdmin {
  id: number;
  nombre: string;
  descripcion: string | null;
  id_area: number;
  activo: boolean;
  Area: {
    id: number;
    nombre: string;
  };
  Adjuntos: Array<{
    id: number;
    titulo: string;
    descripcion: string | null;
    archivo_nombre: string;
    archivo_mime: string | null;
    createdAt: string;
  }>;
  Niveles: PlanFormacionNivel[];
}

export interface PlanDesempenoPerfilResponse {
  adult: {
    id: number;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
    };
  };
  canCreatePlan: boolean;
  canAccessWorkspace: boolean;
  canManagePlan: boolean;
  planes: PlanDesempenoDetalle[];
}

export interface PlanDesempenoDetalle {
  id: number;
  anio: number;
  estado: 'BORRADOR' | 'EN_CURSO' | 'FINALIZADO' | 'APROBADO';
  fecha_inicio: string;
  fecha_cierre: string | null;
  observaciones_generales: string | null;
  canManage: boolean;
  Adulto: {
    id: number;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
    };
  };
  APF: {
    id: number;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
    };
  };
  PlanFormacionTemplate: {
    id: number;
    nombre: string;
    descripcion: string | null;
    id_area: number;
    Area: {
      id: number;
      nombre: string;
    };
    Niveles: PlanFormacionNivel[];
  };
  Competencias: Array<{
    id: number;
    validada: boolean;
    observacion_apf: string | null;
    fecha_validacion: string | null;
    id_competencia_template: number;
    id_apf_validador: number | null;
  }>;
}

export interface PlanFormacionNivel {
  id: number;
  orden: number;
  nombre: string;
  descripcion: string | null;
  Competencias: PlanFormacionCompetencia[];
}

export interface PlanFormacionCompetencia {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: 'ESENCIAL' | 'ESPECIFICA';
  Comportamientos: Array<{
    id: number;
    orden: number;
    descripcion: string;
  }>;
  Aprendizajes: Array<{
    id: number;
    orden: number;
    descripcion: string;
    obligatoria: boolean;
  }>;
  ResultadosEsperados: Array<{
    id: number;
    orden: number;
    descripcion: string;
  }>;
}

export interface CreatePlanDesempenoPayload {
  idPlanFormacionTemplate: number;
  idApfAdulto: number;
  anio: number;
  observacionesGenerales?: string;
}

export interface UpdatePlanDesempenoCompetenciaPayload {
  validada: boolean;
  observacionApf?: string;
}

export interface CreateTemplatePayload {
  nombre: string;
  descripcion?: string | null;
  idArea: number;
  activo?: boolean;
  niveles: Array<{
    orden: number;
    nombre: string;
    descripcion?: string | null;
    competencias: Array<{
      nombre: string;
      descripcion?: string | null;
      tipo: 'ESENCIAL' | 'ESPECIFICA';
      comportamientos?: Array<{ descripcion: string }>;
      aprendizajes?: Array<{
        descripcion: string;
        obligatoria?: boolean;
      }>;
      resultados?: Array<{ descripcion: string }>;
    }>;
  }>;
}

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export interface CreateAdjuntoFormacionPayload {
  titulo: string;
  descripcion?: string;
  archivoNombre: string;
  archivoMime: string;
  archivoBase64: string;
}

export interface DownloadAdjuntoFormacionResponse {
  id: number;
  titulo: string;
  descripcion: string | null;
  archivo_nombre: string;
  archivo_mime: string | null;
  archivoBase64: string;
}

export interface CreateAsignacionApfPayload {
  idAdulto: number;
  idConsejo: number;
  observacion?: string;
}

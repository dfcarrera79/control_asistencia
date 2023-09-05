export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Session {
  estaLogeado: boolean;
  currentURL: string;
  token: string | null;
  usuario: string;
}

export interface TokenDecoded {
  sub: string;
  password: string;
  exp: number;
}

export interface ObjectError {
  message: string;
  name: string;
  stack: string;
  config: Config;
}

interface Config {
  url: string;
  method: string;
  headers: Headers;
  params: Params;
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  transitional: Transitional;
}

interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

interface Params {
  id: string;
  clave: string;
}

interface Headers {
  Accept: string;
  token: string;
}

export interface GroupObject {
  codigo: number;
  descripcion: string;
}

export interface FilasEmpleados {
  cedula_ruc: string;
  nombre_completo: string;
  direccion: string;
  cargo: string;
  sueldo_basico: number;
  fecha_ingreso: string;
  no_telefono: string;
  no_celular: string;
  email: string;
  departamento: string;
  genero: string;
  civil: string;
}

export interface Empleados extends FilasEmpleados {
  codigo: number;
}

export interface FilasAlmacenes {
  alm_codigo: number;
  alm_nomcom: string;
  alm_calles: string;
  alm_pais: string;
  alm_ciud: string;
  alm_tlf1: string;
  alm_tlf2: string;
}

export interface RespuestaLugares {
  error: string;
  mensaje: string;
  objetos: Lugares[];
}

export interface RespuestaHorariosAsignados {
  error: string;
  mensaje: string;
  objetos: HorariosAsignados[];
}

export interface HorariosAsignados {
  codigo: number;
  nombre_completo: string;
  alm_nomcom: string;
  direccion: string;
  dias_trabajados: string;
  horario_1: string;
  horario_2: string;
}

export interface RespuestaHorarios {
  error: string;
  mensaje: string;
  objetos: FilasHorarios[];
}

export interface FilasHorarios {
  codigo: number;
  nombre: string;
  dias_trabajados: Diastrabajados;
  inicio1: string;
  fin1: string;
  inicio2: string;
  fin2: string;
}

interface Diastrabajados {
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export interface Lugares {
  codigo: number;
  alm_nomcom: string;
  alm_calles: string;
  alm_ciud: string;
  lat: number;
  long: number;
}

export interface FilasAsignados {
  cedula_ruc: string;
  nombre_completo: string;
  alm_nomcom: string;
  direccion: string;
}

export interface FilasAsignadas {
  codigo: number;
  cedula_ruc: string;
  nombre_completo: string;
  alm_nomcom: string;
  direccion: string;
}

export interface RespuestaEmpleados {
  error: string;
  mensaje: string;
  objetos: Objeto[];
}

interface Objeto {
  usuario_codigo: number;
}

export interface LugarTrabajo {
  alm_nomcom: string;
}

export interface Lugar {
  lugares: string;
}

export interface Horario {
  codigo: number;
  nombre: string;
  inicio1: string;
  fin1: string;
  inicio2: string;
  fin2: string;
}
export interface DiasSemana {
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
}

export interface DiasTrabajados {
  lunes: string;
  jueves: string;
  martes: string;
  miercoles: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export interface HorariosAsignados {
  codigo: number;
  nombre_completo: string;
  alm_nomcom: string;
  dias_trabajados: DiasTrabajados;
  direccion: string;
  horario_1: string;
  horario_2: string;
}

export interface Horarios {
  codigo: number;
  nombre: string;
  dias_trabajados: DiasTrabajados;
  inicio1: string;
  fin1: string;
  inicio2: string;
  fin2: string;
}

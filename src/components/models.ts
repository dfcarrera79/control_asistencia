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

export interface FilasAlmacenes {
  alm_codigo: number;
  alm_nomcom: string;
  alm_calles: string;
  alm_pais: string;
  alm_ciud: string;
  alm_tlf1: string;
  alm_tlf2: string;
}

export interface Lugares {
  alm_codigo: number;
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

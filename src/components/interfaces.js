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

interface RootObject {
  alm_codigo: number;
  alm_nomcom: string;
  alm_calles: string;
  alm_pais: string;
  alm_ciud: string;
  alm_tlf1: string;
  alm_tlf2: string;
}

interface Lugares {
  alm_nomcom: string;
  alm_calles: string;
  alm_ciud: string;
  lat: number;
  long: number;
}

interface Asignados {
  cedula_ruc: string;
  nombre_completo: string;
  alm_nomcom: string;
  direccion: string;
}

interface RootObject {
  codigo: number;
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

interface FilasEmpleados {
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

interface RootObject {
  error: string;
  mensaje: string;
  objetos: Objeto[];
}

interface Objeto {
  usuario_codigo: number;
}

interface RootObject {
  error: string;
  mensaje: string;
  objetos: Objeto[];
}

interface Objeto {
  codigo: number;
  alm_nomcom: string;
  alm_calles: string;
  alm_ciud: string;
  lat: number;
  long: number;
}

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

interface RootObject {
  error: string;
  mensaje: string;
  objetos: Objeto[];
}

interface Objeto {
  codigo: number;
  lat: number;
  long: number;
}

interface Horarios {
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
  jueves: string;
  martes: string;
  miercoles: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

interface RootObject {
  codigo: number;
  nombre: string;
  dias_trabajados: Diastrabajados;
  inicio1: string;
  fin1: string;
  inicio2?: any;
  fin2?: any;
}

interface Diastrabajados {
  lunes: string;
  jueves: string;
  martes: string;
  sabado: string;
  domingo: string;
  viernes: string;
  miercoles: string;
}

interface RootObject {
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
  jueves: string;
  martes: string;
  sabado: string;
  domingo: string;
  viernes: string;
  miercoles: string;
}

interface RootObject {
  codigo: number;
  nombre_completo: string;
  alm_nomcom: string;
  dias_trabajados: Diastrabajados;
  direccion: string;
  horario_1: string;
  horario_2: string;
}

interface Diastrabajados {
  lunes: string;
  jueves: string;
  martes: string;
  sabado: string;
  domingo: string;
  viernes: string;
  miercoles: string;
}

interface RootObject {
  id_exepcion: number;
  nombre_exepcion: string;
}

import moment from 'moment';
import { QTableProps } from 'quasar';
import {
  formatearFechas,
  obtenerHorasYMinutos,
  obtenerMinutosYSegundos,
} from '../services/useWorkDays';

export const columnasAsignacion: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Cedula/Ruc', field: 'codigo' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'lugar',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
  {
    name: 'direccion',
    align: 'left',
    label: 'Dirección del lugar de trabajo',
    field: 'direccion',
  },
];

export const columnasLugaresTrabajo: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Id', field: 'alm_codigo' },
  {
    name: 'nomcom',
    align: 'left',
    label: 'Nombre del lugar',
    field: 'alm_nomcom',
    sortable: true,
  },
  { name: 'calles', align: 'left', label: 'Dirección', field: 'alm_calles' },
  { name: 'pais', align: 'left', label: 'País', field: 'alm_pais' },
  {
    name: 'ciudad',
    align: 'left',
    label: 'Ciudad',
    field: 'alm_ciud',
    sortable: true,
  },
  { name: 'telefono', align: 'left', label: 'Teléfono 1', field: 'alm_tlf1' },
  { name: 'telefon', align: 'left', label: 'Teléfono 2', field: 'alm_tlf2' },
];

export const columnasAsignacionLugares: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'Codigo', field: 'codigo' },
  { name: 'id', align: 'left', label: 'Cédula', field: 'cedula_ruc' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'direccion',
    align: 'left',
    label: 'Dirección',
    field: 'direccion',
  },
  {
    name: 'cargo',
    align: 'left',
    label: 'Cargo',
    field: 'cargo',
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
  },
  {
    name: 'sueldo',
    align: 'left',
    label: 'Sueldo',
    field: 'sueldo_basico',
  },
  {
    name: 'fecha',
    align: 'left',
    label: 'Fecha de Ingreso',
    field: 'fecha_ingreso',
  },
  {
    name: 'telefono',
    align: 'left',
    label: 'Teléfono',
    field: 'no_telefono',
  },
  {
    name: 'celular',
    align: 'left',
    label: 'Celular',
    field: 'no_celular',
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
  },
  {
    name: 'genero',
    align: 'left',
    label: 'Género',
    field: 'genero',
  },
  {
    name: 'civil',
    align: 'left',
    label: 'Estado Civil',
    field: 'civil',
  },
];

export const columnasSupleRegistros: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'Codigo', field: 'codigo' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo_usuario',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
  },
  { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha' },
  { name: 'horas', align: 'left', label: 'Horas', field: 'horas' },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado por',
    field: 'asignado_por',
  },
];

export const columnasHorasSuple: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'Codigo', field: 'codigo' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
  },
];

export const columnasCelulares: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'codigo' },
  { name: 'id', align: 'left', label: 'Cedula', field: 'cedula_ruc' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'id',
    align: 'left',
    label: 'Id Dispositivo',
    field: 'id_dispositivo',
  },
];

export const columnasFotos: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'id_foto' },
  { name: 'id', align: 'left', label: 'Cedula', field: 'cedula_ruc' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'foto',
    align: 'left',
    label: 'Foto',
    field: 'path',
  },
];

export const columnasRegistrosBio: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'codigo' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'registro',
    align: 'left',
    label: 'Registro',
    field: 'registro',
  },
  {
    name: 'anulado',
    align: 'left',
    label: 'Anulado por',
    field: 'anulado_por',
  },
];

export const columnasRegistrosExepciones: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'usuario_codigo' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'alm_nomcom',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
];

export const columnasAutorizados: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'id' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'excepcion',
    align: 'left',
    label: 'Tipo de exepcion',
    field: 'excepcion',
  },
  {
    name: 'dias',
    align: 'left',
    label: 'Dias de exepcion',
    field: (row) => formatearFechas(row.dias),
  },
  {
    name: 'autorizado_por',
    align: 'left',
    label: 'Autorizado por',
    field: 'autorizado_por',
  },
];

export const columnasAutorizacion: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'usuario_codigo' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'alm_nomcom',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
  {
    name: 'excepcion',
    align: 'left',
    label: 'Tipo de exepcion',
    field: 'excepcion',
  },
  {
    name: 'dias',
    align: 'left',
    label: 'Dias de exepcion',
    field: (row) => formatearFechas(row.dias),
  },
];

export const columnasConsolidarMes: QTableProps['columns'] = [
  {
    name: 'codigo',
    align: 'left',
    label: 'ID',
    field: 'codigo_detalle',
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
  },
  {
    name: 'horas',
    align: 'left',
    label: 'Hora trabajadas',
    field: (row) => obtenerHorasYMinutos(row.normal),
  },
  {
    name: 'suplementarias',
    align: 'left',
    label: 'Horas suplementarias',
    field: (row) =>
      row.suplementarias !== null ? `${row.suplementaria} H` : '0 H',
  },
  {
    name: 'atrasos',
    align: 'left',
    label: 'Atrasos',
    field: (row) => obtenerMinutosYSegundos(row.atrasos),
  },
];

export const columnasAsistencias: QTableProps['columns'] = [
  {
    name: 'codigo',
    align: 'left',
    label: 'ID',
    field: 'codigo',
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: 'nombre_completo',
  },
  {
    name: 'lugar',
    align: 'left',
    label: 'Lugar asignado',
    field: 'lugar_asignado',
  },
  {
    name: 'entrada',
    align: 'left',
    label: 'Hora de entrada',
    field: (row) => moment(row.entrada).format('HH:mm - DD/MM/YY'),
    sortable: true,
  },
  {
    name: 'salida',
    label: 'Hora de salida',
    field: (row) => moment(row.salida).format('HH:mm - DD/MM/YY'),
    align: 'left',
    sortable: true,
  },
];

export const columnasAsistenciasCalculadas: QTableProps['columns'] = [
  {
    name: 'codigo',
    align: 'left',
    label: 'ID',
    field: 'codigo',
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'lugar',
    align: 'left',
    label: 'Lugar asignado',
    field: 'alm_nomcom',
    sortable: true,
  },
  {
    name: 'horas',
    align: 'left',
    label: 'Hora trabajadas',
    field: (row) => obtenerHorasYMinutos(row.horas_trabajadas),
  },
  {
    name: 'suplementarias',
    align: 'left',
    label: 'Horas suplementarias',
    field: (row) =>
      row.horas_suplementarias !== null
        ? `${row.horas_suplementarias} H`
        : '0 H',
  },
  {
    name: 'atrasos',
    align: 'left',
    label: 'Atrasos',
    field: (row) => obtenerMinutosYSegundos(row.atrasos),
  },
];

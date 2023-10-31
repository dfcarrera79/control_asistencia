import {
  DiasTrabajados,
  Horarios,
  HorariosAsignados,
} from '../components/models';
import moment from 'moment';

export const getSortedWorkDays = (row: Horarios) => {
  const newVar = row.dias_trabajados;

  if (Array.isArray(newVar)) {
    // Verificar si todos los elementos son strings
    const cadenas = newVar.map(
      (objeto) => `Desde: ${objeto.from} Hasta: ${objeto.to}`
    );
    return cadenas.join('; ');
  } else {
    const days = (
      Object.keys(row.dias_trabajados) as Array<keyof DiasTrabajados>
    )
      .filter((day) => row.dias_trabajados[day] === 'true')
      .sort((a, b) => {
        const order = [
          'lunes',
          'martes',
          'miercoles',
          'jueves',
          'viernes',
          'sabado',
          'domingo',
        ];
        return order.indexOf(a) - order.indexOf(b);
      });

    return days.join(', ');
  }
};

const formatTimeRange = (timeRangeString: string) => {
  if (timeRangeString === null) {
    return '';
  }
  const [startTime, endTime] = timeRangeString.split(' ');
  const formattedStartTime = startTime.replace(':', ':');
  const formattedEndTime = endTime.replace(':', ':');
  return `(${formattedStartTime} - ${formattedEndTime})`;
};

export const getTimeFormated = (row: HorariosAsignados) => {
  const horario_1 = row.horario_1;
  const horario_2 = row.horario_2;

  return `${formatTimeRange(horario_1)} ${formatTimeRange(horario_2)}`;
};

// export function formatearFechas(fechas: string[]) {
//   if (fechas.length === 0) {
//     return '';
//   }

//   const fechasFormateadas = [];
//   let fechaInicial = moment(fechas[0]);
//   let fechaFinal = fechaInicial;

//   for (let i = 1; i < fechas.length; i++) {
//     const fecha = moment(fechas[i]);

//     if (
//       fecha.diff(fechaFinal, 'days') === 1 &&
//       fecha.month() === fechaFinal.month()
//     ) {
//       fechaFinal = fecha;
//     } else {
//       fechasFormateadas.push(formatoFechas(fechaInicial, fechaFinal));
//       fechaInicial = fecha;
//       fechaFinal = fecha;
//     }
//   }

//   fechasFormateadas.push(formatoFechas(fechaInicial, fechaFinal));

//   return fechasFormateadas.join(', ');
// }

export function formatearFechas(fechas: string[]) {
  if (fechas.length === 0) {
    return '';
  }

  const fechasFormateadas = [];
  let fechaInicial = moment(fechas[0], 'YYYY/MM/DD'); // Especifica el formato
  let fechaFinal = fechaInicial;

  for (let i = 1; i < fechas.length; i++) {
    const fecha = moment(fechas[i], 'YYYY/MM/DD'); // Especifica el formato

    if (
      fecha.diff(fechaFinal, 'days') === 1 &&
      fecha.month() === fechaFinal.month()
    ) {
      fechaFinal = fecha;
    } else {
      fechasFormateadas.push(formatoFechas(fechaInicial, fechaFinal));
      fechaInicial = fecha;
      fechaFinal = fecha;
    }
  }

  fechasFormateadas.push(formatoFechas(fechaInicial, fechaFinal));

  return fechasFormateadas.join(', ');
}

function formatoFechas(
  fechaInicial: moment.Moment,
  fechaFinal: moment.Moment
): string {
  if (fechaInicial.isSame(fechaFinal, 'day')) {
    return fechaInicial.format('DD/MM/YY');
  } else {
    return `${fechaInicial.format('DD')} - ${fechaFinal.format('DD/MM/YY')}`;
  }
}

export const obtenerHorasYMinutos = (horas: number) => {
  // Extraer las partes enteras y decimales de las horas
  const horasEnteras = Math.floor(horas);
  const minutosDecimales = (horas - horasEnteras) * 60;

  // Formatear el resultado en "horas: minutos"
  const formatoHorasMinutos = `${horasEnteras}H ${Math.round(
    minutosDecimales
  )}min`;

  return formatoHorasMinutos;
};

export const obtenerMinutosYSegundos = (minutos: number) => {
  // Extraer las partes enteras y decimales de las horas
  const minutosEnteros = Math.floor(minutos);
  const segundosDecimales = (minutos - minutosEnteros) * 60;

  // Formatear el resultado en "horas: minutos"
  const formatoHorasMinutos = `${minutosEnteros}min ${Math.round(
    segundosDecimales
  )}seg`;

  return formatoHorasMinutos;
};

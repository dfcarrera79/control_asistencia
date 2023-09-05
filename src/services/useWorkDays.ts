import {
  DiasTrabajados,
  Horarios,
  HorariosAsignados,
} from '../components/models';

export const getSortedWorkDays = (row: Horarios) => {
  const days = (Object.keys(row.dias_trabajados) as Array<keyof DiasTrabajados>)
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

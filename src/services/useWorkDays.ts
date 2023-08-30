export const getSortedWorkDays = (row) => {
  const days = Object.keys(row.dias_trabajados)
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

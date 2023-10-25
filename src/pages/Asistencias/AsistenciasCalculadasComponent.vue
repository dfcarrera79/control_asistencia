<template>
  <div>
    <div class="column">
      <div>
        <p
          class="text-h6 text-grey-8 q-pl-md"
          style="font-family: 'Bebas Neue'"
        >
          Asistencias y atrasos
        </p>
      </div>

      <div class="col-12 text-grey-8 gt-xs q-pl-md">
        <p>
          <strong>Nota:</strong> Seleccione un rango de fechas (desde - hasta).
        </p>
      </div>

      <div class="row justify-left items-center q-py-sm q-pr-md">
        <div class="q-pr-md">
          <q-input
            outlined
            class="q-pl-md"
            input-class="text-right"
            clearable
            clear-icon="close"
            dense
            debounce="350"
            borderless
            color="primary"
            v-model="filter"
            placeholder="Buscar..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="q-ma-sm" style="width: 250px">
          <q-select
            dense
            filled
            v-model="lugar"
            use-input
            hide-selected
            fill-input
            input-debounce="300"
            label="Lugares asignados"
            :options="opcionesLugares"
            @filter="filtroLugaresFn"
            style="width: 250px"
          >
            <template v-if="lugar" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="lugar = ''"
                class="cursor-pointer"
              />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="q-ma-sm" style="max-width: 200px">
          <q-input
            debounce="350"
            v-model="desde"
            mask="date"
            outlined
            dense
            options-dense
            label="Fecha desde:"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="desde" minimal>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="q-ma-sm" style="max-width: 200px">
          <q-input
            debounce="350"
            v-model="hasta"
            mask="date"
            outlined
            dense
            options-dense
            label="Fecha hasta:"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="hasta" minimal>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="q-pl-md q-py-sm">
          <q-btn
            color="primary"
            icon="search"
            label="Consultar"
            @click="obtenerCalculos(lugar)"
            :disable="desde == '' || hasta == ''"
          />
        </div>
      </div>
    </div>

    <div>
      <q-table
        flat
        bordered
        class="my-sticky-header-table text-h6 text-grey-8"
        :rows="filas"
        :columns="columnas"
        selection="multiple"
        v-model:selected="selected"
        row-key="codigo"
        hide-bottom
        hide-pagination
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="[
          'nombre',
          'lugar',
          'horas',
          'suplementarias',
          'atrasos',
        ]"
      />
      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { Lugar, AsistenciasAtrasos } from '../../components/models';

// Data
const { get } = useAxios();
const selected = ref([]);
const filter = ref('');
const desde = ref('');
const hasta = ref('');
const yearOptions = ref<number[]>([]);
// const selectedYear = ref(null);
// const selectedMonth = ref(null);
// const horasSuplementarias = ref(0);

// interface Meses {
//   nombre: string;
//   codigo: number;
// }

// const monthOptions = ref<Meses[]>([
//   { nombre: 'Enero', codigo: 1 },
//   { nombre: 'Febrero', codigo: 2 },
//   { nombre: 'Marzo', codigo: 3 },
//   { nombre: 'Abril', codigo: 4 },
//   { nombre: 'Mayo', codigo: 5 },
//   { nombre: 'Junio', codigo: 6 },
//   { nombre: 'Julio', codigo: 7 },
//   { nombre: 'Agosto', codigo: 8 },
//   { nombre: 'Septiembre', codigo: 9 },
//   { nombre: 'Octubre', codigo: 10 },
//   { nombre: 'Noviembre', codigo: 11 },
//   { nombre: 'Diciembre', codigo: 12 },
// ]);
const lugar = ref('');
const lugares = ref<string[]>([]);
const opcionesLugares = ref(lugares.value);

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

const filas = ref<AsistenciasAtrasos[]>([]);
const columnas: QTableProps['columns'] = [
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

// Methods
const filtroLugaresFn = (
  val: string,
  update: (callback: () => void) => void
) => {
  if (val === '') {
    update(() => {
      opcionesLugares.value = lugares.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesLugares.value = lugares.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const obtenerLugaresTrabajo = async () => {
  const respuesta = await get('/obtener_lugar_empleado', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  const data: Lugar[] = respuesta.objetos;
  lugares.value = [...new Set(data.map((item) => item.lugares))];
};

const obtenerCalculos = async (modelo: string) => {
  const respuesta = await get('/calcular_horas_atrasos', {
    lugar: modelo,
    fecha_desde: desde.value,
    fecha_hasta: hasta.value,
  });
  if (respuesta.error === 'S') {
    filas.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    filas.value = [];
  } else {
    filas.value = respuesta.objetos;
  }
};

const obtenerHorasYMinutos = (horas: number) => {
  // Extraer las partes enteras y decimales de las horas
  const horasEnteras = Math.floor(horas);
  const minutosDecimales = (horas - horasEnteras) * 60;

  // Formatear el resultado en "horas: minutos"
  const formatoHorasMinutos = `${horasEnteras}H ${Math.round(
    minutosDecimales
  )}min`;

  return formatoHorasMinutos;
};

const obtenerMinutosYSegundos = (minutos: number) => {
  // Extraer las partes enteras y decimales de las horas
  const minutosEnteros = Math.floor(minutos);
  const segundosDecimales = (minutos - minutosEnteros) * 60;

  // Formatear el resultado en "horas: minutos"
  const formatoHorasMinutos = `${minutosEnteros}min ${Math.round(
    segundosDecimales
  )}seg`;

  return formatoHorasMinutos;
};

// Función para obtener el año actual
const getCurrentYear = (): number => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

// Rellenar opciones de año desde el año actual hasta 5 años en el futuro
onMounted(() => {
  const currentYear = getCurrentYear();
  const maxYear = currentYear + 3;
  for (let year = currentYear - 3; year <= maxYear; year++) {
    yearOptions.value.push(year);
  }
});

onMounted(() => {
  obtenerLugaresTrabajo();
});
</script>

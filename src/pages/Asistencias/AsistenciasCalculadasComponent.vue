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
        <div class="q-mx-sm" style="width: 250px">
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
        <div class="q-mx-sm" style="max-width: 200px">
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

        <div class="q-mx-sm" style="max-width: 200px">
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

        <div class="q-pl-md">
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
        row-key="codigo"
        hide-bottom
        hide-pagination
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="['nombre', 'lugar', 'horas', 'atrasos']"
      >
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { Lugar, AsistenciasAtrasos } from '../../components/models';

// Data
const { get } = useAxios();

const filter = ref('');
const desde = ref('');
const hasta = ref('');

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

onMounted(() => {
  obtenerLugaresTrabajo();
});
</script>

<template>
  <div>
    <div class="column">
      <div>
        <p class="text-h6 q-pl-md" style="font-family: 'Bebas Neue'">
          Registros por Usuario
        </p>
      </div>

      <div class="col-12 gt-xs q-pl-md">
        <p>
          <strong>Nota:</strong> Seleccione el empleado y el rango de fechas
          (desde - hasta). También puede filtrar la lista de empleados por lugar
          asignado de trabajo.
        </p>
      </div>

      <div class="row justify-left items-center">
        <div class="row items-center q-py-sm q-pr-md">
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
                  <q-item-section> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="q-ma-sm" style="width: 250px">
            <q-select
              dense
              filled
              v-model="empleado"
              use-input
              hide-selected
              fill-input
              input-debounce="300"
              label="Empleado"
              :options="opcionesEmpleados"
              @filter="filtroFn"
              style="width: 250px"
            >
              <template v-if="empleado" v-slot:append>
                <q-icon
                  name="cancel"
                  class="cursor-pointer"
                  @click.stop.prevent="empleado = ''"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section> No hay resultados </q-item-section>
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

          <div class="q-ml-sm" style="max-width: 200px">
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
        </div>

        <div class="q-pl-none q-py-sm row items-center">
          <q-btn
            unelevated
            color="primary"
            label="Buscar asistencias"
            @click="handleAsistenciasClicked"
            :disable="empleado == '' || desde == '' || hasta == ''"
          />
        </div>

        <div class="q-pl-md q-py-sm row items-center">
          <q-btn
            unelevated
            color="primary"
            label="Buscar atrasos"
            @click="handleAtrasosClicked"
            :disable="empleado == '' || desde == '' || hasta == ''"
          />
        </div>
      </div>
    </div>

    <div>
      <q-table
        flat
        bordered
        class="my-sticky-header-table text-h6"
        :rows="filas"
        :columns="columnas"
        row-key="codigo"
        hide-bottom
        v-model:pagination="pagination"
        hide-pagination
        :visible-columns="['nombre', 'lugar', 'entrada', 'salida']"
      >
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-if="pagesNumber > 1"
          size="12px"
          v-model="page"
          :max="pagesNumber"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          color="primary"
          unelevated
          flat
          active-design="flat"
          active-color="white"
          active-text-color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { computed, onMounted, ref, watch } from 'vue';
import {
  Lugar,
  RespuestaAsignados,
  RespuestaNumero,
  RespuestaAtrasos,
} from '../../components/models';

// Data
const $q = useQuasar();
const { get } = useAxios();

interface Empleados {
  codigo: number;
  nombre_completo: string;
}
const empleado = ref('');
const empleados = ref<string[]>([]);
const employees = ref<Empleados[]>([]);
const opcionesEmpleados = ref(empleados);

const page = ref(1);
const numFilas = ref(0);
const desde = ref('');
const hasta = ref('');
const lugar = ref('');
const lugares = ref<string[]>([]);
const opcionesLugares = ref(lugares.value);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: page.value,
  rowsPerPage: 10,
  rowsNumber: numFilas,
});

const filas = ref([]);

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

//Methods
const obtenerCodigo = (nombreCompleto: string) => {
  const empleado = employees.value.find(
    (empleado) => empleado.nombre_completo === nombreCompleto
  );
  return empleado ? empleado.codigo : null;
};

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

const filtroFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      opcionesEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesEmpleados.value = empleados.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const obtenerNumeroPaginas = async () => {
  const codigo = obtenerCodigo(empleado.value);
  const respuesta: RespuestaNumero = await get('/obtener_numero_paginas', {
    usuario_codigo: codigo,
    fecha_desde: desde.value,
    fecha_hasta: hasta.value,
  });

  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  if (respuesta.error === 'N') {
    numFilas.value = respuesta.objetos[0].count;
  }
};

const obtenerNumeroPaginasAtrasos = async () => {
  const codigo = obtenerCodigo(empleado.value);
  const respuesta: RespuestaAtrasos = await get(
    '/obtener_numero_paginas_atrasos',
    {
      usuario_codigo: codigo,
      fecha_desde: desde.value,
      fecha_hasta: hasta.value,
    }
  );
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  numFilas.value = respuesta.objetos;
};

const obtenerAsistencias = async () => {
  const codigo = obtenerCodigo(empleado.value);
  const response = await get('/obtener_asistencias', {
    usuario_codigo: codigo,
    fecha_desde: desde.value,
    fecha_hasta: hasta.value,
    numero_de_pagina: page.value,
    registros_por_pagina: pagination.value.rowsPerPage,
  });

  if (response.error === 'S') {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: response.mensaje,
    });
    return;
  }
  filas.value = response.objetos;
};

const obtenerAtrasos = async () => {
  const codigo = obtenerCodigo(empleado.value);

  const response = await get('/obtener_atrasos', {
    usuario_codigo: codigo,
    fecha_desde: desde.value,
    fecha_hasta: hasta.value,
  });

  if (response.error === 'S') {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: response.mensaje,
    });
    return;
  }
  filas.value = response.objetos;
};

const handleAsistenciasClicked = () => {
  obtenerNumeroPaginas();
  obtenerAsistencias();
};

const handleAtrasosClicked = () => {
  obtenerNumeroPaginasAtrasos();
  obtenerAtrasos();
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

const obtenerEmpleadosAsignados = async (modelo: string) => {
  const respuesta: RespuestaAsignados = await get(
    '/obtener_empleados_asignados',
    {
      lugar: modelo,
    }
  );

  if (respuesta.error === 'S') {
    empleados.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    empleados.value = [];
  } else {
    const datos = respuesta.objetos;
    empleados.value = datos.map((item) => item.nombre_completo);
    employees.value = datos.map((item) => ({
      codigo: item.codigo,
      nombre_completo: item.nombre_completo,
    }));
  }
};

onMounted(() => {
  obtenerLugaresTrabajo();
  obtenerEmpleadosAsignados(lugar.value);
});

watch(lugar, () => {
  obtenerEmpleadosAsignados(lugar.value);
});

// Computed
const pagesNumber = computed(() => {
  return Math.ceil(numFilas.value / pagination.value.rowsPerPage);
});

watch(page, () => {
  obtenerAsistencias();
});
</script>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

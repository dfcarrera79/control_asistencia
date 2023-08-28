<template>
  <div class="q-pa-md">
    <div class="column">
      <div class="row">
        <div>
          <p
            class="text-h6 text-grey-8 q-pl-md"
            style="font-family: 'Bebas Neue'"
          >
            Asignación de Horarios
          </p>
        </div>
        <div class="q-pl-md">
          <q-btn flat rounded color="primary" icon="update" dense>
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <strong class="text-caption">Actualizar tabla</strong>
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="row justify-left">
        <div class="row q-py-sm q-pr-md">
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
          <div style="width: 250px">
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
              @filter="filtroFn"
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
        </div>

        <q-separator vertical />

        <div class="q-pl-md q-py-sm row">
          <div style="width: 250px">
            <q-select
              dense
              outlined
              v-model="opcionesHorarios"
              :options="options"
              emit-value
              option-label="nombre"
              :display-value="
                opcionesHorarios ? displaySelectedValue : '*none*'
              "
            />
          </div>
          <div class="q-pl-md">
            <q-btn
              color="primary"
              label="Asignar Horario"
              icon="access_time"
              @click="handleButtonClicked(opcionesHorarios.codigo, selected)"
              :disable="opcionesHorarios.codigo == 0 || selected.length == 0"
            />
          </div>
        </div>
      </div>
    </div>
    <q-scroll-area style="height: 550px">
      <div class="q-pa-md">
        <q-table
          square
          flat
          bordered
          hide-bottom
          :rows="filas"
          :columns="columnas"
          :filter="filter"
          row-key="cedula_ruc"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          v-model:selected="selected"
          :rows-per-page-options="[0]"
          v-model:pagination="pagination"
        >
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              <q-icon name="done" size="1.5em" color="green" />
              {{ props.row.nombre_completo }}
            </q-td>
          </template>
        </q-table>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { FilasAsignadas, Lugar, Horario } from '../../components/models';

// Data
const $q = useQuasar();
const filter = ref('');
const { get, put } = useAxios();
const filas = ref<FilasAsignadas[]>([]);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const selected = ref([]);
const lugar = ref('');
const lugares = ref<string[]>([]);
const opcionesLugares = ref(lugares.value);
const horarios = ref<string[]>([]);

const options = ref<Horario[]>([]);
const opcionesHorarios = ref({
  codigo: 0,
  nombre: '',
  inicio1: '',
  fin1: '',
  inicio2: '',
  fin2: '',
});

const columnas: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Cedula/Ruc', field: 'cedula_ruc' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
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

// Methods
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${filas.value.length}`;
};

const displaySelectedValue = computed(() => {
  if (
    opcionesHorarios.value.nombre === '' &&
    opcionesHorarios.value.inicio1 === '' &&
    opcionesHorarios.value.fin1 === '' &&
    opcionesHorarios.value.inicio2 === '' &&
    opcionesHorarios.value.fin2 === ''
  )
    return 'Horarios';
  const { nombre, inicio1, fin1, inicio2, fin2 } = opcionesHorarios.value;

  let displayString = `${nombre} (${inicio1} - ${fin1})`;

  if (inicio2 !== null && inicio2 !== '' && fin2 !== null && fin2 !== '') {
    displayString += `, (${inicio2} - ${fin2})`;
  }
  return displayString;
});

const filtroFn = (val: string, update: (callback: () => void) => void) => {
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

const obtenerHorarios = async () => {
  const respuesta = await get('/obtener_horarios', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  const data: Horario[] = respuesta.objetos;
  options.value = data;
  console.log('[HORARIO data]: ', data);
  horarios.value = [...new Set(data.map((item) => item.nombre))];
};

const obtenerEmpleadosAsignados = async (modelo: string) => {
  const respuesta = await get('/obtener_empleados_asignados', {
    lugar: modelo,
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

const designar_horario_empleado = async (
  turno_codigo: number,
  usuario_codigo: number
) => {
  try {
    const response = await put(
      '/asignar_horario',
      {},
      JSON.parse(
        JSON.stringify({
          turno_codigo: turno_codigo,
          usuario_codigo: usuario_codigo,
        })
      )
    );

    if (response.error === 'N') {
      console.log('[RESPONSE]: ', response);
    }
    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error asignando empleado a horario:', error);
  }
};

const handleButtonClicked = async (id: number, selected: FilasAsignadas[]) => {
  for (const item of selected) {
    await designar_horario_empleado(id, item.codigo);
  }
};

onMounted(() => {
  obtenerHorarios();
  obtenerLugaresTrabajo();
  obtenerEmpleadosAsignados(lugar.value);
});

watch(lugar, () => {
  obtenerEmpleadosAsignados(lugar.value);
});
</script>

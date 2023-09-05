<template>
  <div class="q-pa-md">
    <div class="column">
      <div class="row">
        <div>
          <p
            class="text-h6 text-grey-8 q-pl-md"
            style="font-family: 'Bebas Neue'"
          >
            EMPLEADOS
          </p>
        </div>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="enviarDepartamento(model)"
          >
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
        <div class="row q-py-sm">
          <div>
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

          <div>
            <q-select
              class="q-px-md"
              outlined
              dense
              v-model="model"
              :options="props.grupos"
              label="Departamentos"
              style="width: 200px"
            >
              <template v-if="model" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="model = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </div>
        </div>

        <q-separator vertical />

        <div class="q-pl-md q-py-sm row">
          <div style="width: 250px">
            <q-select
              filled
              dense
              v-model="lugar"
              use-input
              hide-selected
              fill-input
              input-debounce="300"
              label="Lugares de trabajo"
              :options="options"
              @filter="filterFn"
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
          <div class="q-pl-md">
            <q-btn
              color="primary"
              label="Asignar lugar de trabajo"
              @click="handleButtonClicked(id_direccion, selected)"
              icon="business"
              :disable="selected.length === 0 || id_direccion === 0"
            />
          </div>
        </div>
      </div>
      <div class="column justify-left q-pl-md q-pt-md">
        <strong class="text-weight-medium text-grey-8"
          >Dirección: {{ direccion }}
        </strong>
      </div>
    </div>
    <q-scroll-area style="height: 550px">
      <div class="q-pa-md">
        <q-table
          square
          flat
          bordered
          hide-bottom
          :rows="props.filas"
          :columns="columnas"
          :filter="filter"
          row-key="codigo"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          v-model:selected="selected"
          :rows-per-page-options="[0]"
          v-model:pagination="pagination"
          :visible-columns="columnasVisibles"
        >
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              <q-icon
                name="done"
                size="1.5em"
                color="green"
                v-if="
                  empleadosAsignados.includes(props.row.codigo) ? true : false
                "
              />
              {{ props.row.nombre_completo }}
            </q-td>
          </template>
        </q-table>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { Empleados, FilasEmpleados, Lugares } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  filas: FilasEmpleados[];
  grupos: string[];
  lugares: string[];
  direcciones: Lugares[];
  empleadosAsignados: number[];
}>();

/* defined emits*/
const emit = defineEmits(['actualizarFilas']);

// Data
const lugar = ref('');
const model = ref('');
const filter = ref('');
const $q = useQuasar();
const selected = ref([]);
const direccion = ref('');
const id_direccion = ref(0);
const { put } = useAxios();
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const options = ref(props.lugares);

const columnasVisibles = ref([
  'id',
  'nombre',
  'cargo',
  'telefono',
  'celular',
  'email',
  'departamento',
]);

const columnas: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'Codigo', field: 'codigo' },
  { name: 'id', align: 'left', label: 'Cedula', field: 'cedula_ruc' },
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

// Methods
const filterFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      options.value = props.lugares;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = props.lugares.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${props.filas.length}`;
};

const designar_lugar_empleado = async (
  targetId: number,
  targetCodigo: number
) => {
  try {
    const response = await put(
      '/designar_lugar_empleado',
      {},
      JSON.parse(
        JSON.stringify({
          alm_codigo: targetId,
          usuario_codigo: targetCodigo,
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
    console.error('Error asignando empleado a lugar de trabajo:', error);
  }
};

const handleButtonClicked = async (id: number, selected: Empleados[]) => {
  for (const item of selected) {
    await designar_lugar_empleado(id, item.codigo);
  }
};

const getCalles = (lugar: string) => {
  if (lugar === '' || lugar === null) {
    direccion.value = '';
    id_direccion.value = 0;
  } else {
    const calles: Lugares | undefined = props.direcciones.find(
      (l) => l.alm_nomcom === lugar
    );
    direccion.value = calles.alm_calles;
    id_direccion.value = calles.codigo;
  }
};

const enviarDepartamento = (event: string) => {
  emit('actualizarFilas', event);
};

watch(model, (newValue) => {
  enviarDepartamento(newValue);
});

watch(lugar, () => {
  getCalles(lugar.value);
});
</script>

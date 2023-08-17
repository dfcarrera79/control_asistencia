<template>
  <div class="q-pa-md">
    <div>
      <h4
        class="row text-uppercase text-grey-8 justify-center content-center"
        style="font-family: 'Bebas Neue'"
      >
        <div class="q-pt-sm">GESTIÓN DE EMPLEADOS</div>
      </h4>
    </div>

    <div class="q-gutter-y-sm">
      <q-card flat>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-2 text-grey-9"
          active-color="primary"
          indicator-color="primary"
          style="font-family: 'Oswald'"
          align="justify"
          narrow-indicator
        >
          <q-tab
            name="grupos"
            label="Lugares de Trabajo"
            @click="obtenerAlmacenes()"
          />
          <q-tab
            name="perfiles"
            label="Asignación de Lugares de Trabajo"
            @click="reloadTable(model)"
          />
          <q-tab
            name="lugares"
            label="Lista de empleados asignados"
            @click="
              obtenerEmpleadosAsignados(model);
              obtenerLugaresTrabajo();
            "
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="perfiles">
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
                      @click="reloadTable(model)"
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
                        :options="grupos"
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
                        dense
                        clearable
                        filled
                        color="primary"
                        v-model="lugar"
                        :options="lugares.map((lugar) => lugar.alm_nomcom)"
                        label="Lugares"
                      />
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
                    :rows="filas"
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
                            empleadosAsignados.includes(props.row.codigo)
                              ? true
                              : false
                          "
                        />
                        {{ props.row.nombre_completo }}
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="grupos">
            <div class="q-pa-md">
              <div class="column q-pb-md">
                <p
                  class="text-h6 text-grey-8"
                  style="font-family: 'Bebas Neue'"
                >
                  LUGARES DE TRABAJO
                </p>
                <div class="row justify-left">
                  <q-input
                    outlined
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
              </div>
            </div>
            <div class="q-pa-md">
              <q-scroll-area style="height: 550px">
                <q-table
                  square
                  flat
                  bordered
                  hide-bottom
                  :rows="rows"
                  :columns="columns"
                  :filter="filter"
                  row-key="alm_codigo"
                  class="text-h6 text-grey-8"
                  :rows-per-page-options="[0]"
                  v-model:pagination="pagination"
                  :visible-columns="visibleColumns"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width />
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn
                          size="sm"
                          color="primary"
                          round
                          dense
                          @click="
                            props.expand = !props.expand;
                            obtenerCoordenadas(props.row.alm_codigo);
                          "
                          :icon="props.expand ? 'remove' : 'add'"
                        />
                      </q-td>
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">
                          <q-toggle
                            v-if="toogle"
                            v-model="checked"
                            label="Editar coordenadas"
                          />
                          <div class="column justify-start" v-if="checked">
                            <q-btn
                              dense
                              outline
                              color="primary"
                              @click="
                                openGoogleMaps(
                                  `${props.row.alm_calles}, ${props.row.alm_ciud}, ${props.row.alm_pais}`
                                )
                              "
                              style="margin-left: 9px; width: 343px"
                            >
                              Buscar dirección en Google Maps
                            </q-btn>

                            <div class="row justify-start">
                              <q-input
                                dense
                                color="primary"
                                outlined
                                v-model="text"
                                label="Ingresar coordenadas"
                                :rules="[
                                  (val) =>
                                    (val && val.length > 0) ||
                                    'Por favor ingrese las coordenadas',
                                ]"
                                class="q-pa-sm"
                                style="width: 360px"
                              >
                                <template v-slot:append>
                                  <q-icon
                                    name="close"
                                    @click="text = ''"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-input>

                              <q-btn
                                v-if="!toogle"
                                dense
                                label="Guardar"
                                color="primary"
                                icon="save"
                                :ripple="{ center: true }"
                                :disable="text.length === 0"
                                style="
                                  max-width: 150px;
                                  max-height: 39px;
                                  margin-top: 9px;
                                "
                                @click="
                                  registrarCoordenadas(
                                    props.row.alm_codigo,
                                    text
                                  )
                                "
                              />

                              <q-btn
                                v-if="toogle"
                                dense
                                label="Actualizar"
                                color="primary"
                                icon="update"
                                :ripple="{ center: true }"
                                :disable="text.length === 0"
                                style="
                                  max-width: 150px;
                                  max-height: 39px;
                                  margin-top: 9px;
                                "
                                @click="
                                  actualizarCoordenadas(
                                    props.row.alm_codigo,
                                    text
                                  )
                                "
                              />
                            </div>
                          </div>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="lugares">
            <div class="q-pa-md">
              <div class="column q-pb-md">
                <p
                  class="text-h6 text-grey-8"
                  style="font-family: 'Bebas Neue'"
                >
                  EMPLEADOS ASIGNADOS A LUGARES DE TRABAJO
                </p>
                <div class="row justify-left">
                  <q-input
                    outlined
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
                  <div class="q-pl-md">
                    <q-select
                      outlined
                      dense
                      v-model="modelo"
                      :options="groups"
                      label="Lugares de trabajo"
                      style="width: 200px"
                    >
                      <template v-if="modelo" v-slot:append>
                        <q-icon
                          name="cancel"
                          @click.stop.prevent="modelo = ''"
                          class="cursor-pointer"
                        />
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>

              <q-scroll-area style="height: 550px">
                <q-table
                  square
                  flat
                  bordered
                  hide-bottom
                  :rows="zeile"
                  :columns="spalte"
                  :filter="filter"
                  row-key="cedula_ruc"
                  class="text-h6 text-grey-8"
                  :rows-per-page-options="[0]"
                  v-model:pagination="pagination"
                >
                </q-table>
              </q-scroll-area>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import {
  GroupObject,
  FilasEmpleados,
  FilasAlmacenes,
  Lugar,
  Lugares,
  Empleados,
  FilasAsignados,
  RespuestaEmpleados,
} from '../../components/models';

// Data
const $q = useQuasar();
const tab = ref('');
const { get, post, put } = useAxios();
const grupos = ref([]);
const groups = ref([]);
const model = ref('');
const modelo = ref('');
const text = ref('');
const filas = ref<FilasEmpleados[]>([]);
const rows = ref<FilasAlmacenes[]>([]);
const zeile = ref<FilasAsignados[]>([]);
const filter = ref('');
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const lugar = ref('');
const lugares = ref<Lugares[]>([]);
const checked = ref(false);
const toogle = ref(false);
const selected = ref([]);
const direccion = ref('');
const id_direccion = ref(0);

const columnasVisibles = ref([
  'id',
  'nombre',
  'cargo',
  'telefono',
  'celular',
  'email',
  'departamento',
]);

const visibleColumns = ref(['nomcom', 'calles', 'ciudad', 'telefono']);

const spalte: QTableProps['columns'] = [
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

const columns: QTableProps['columns'] = [
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
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${filas.value.length}`;
};

const obtenerGrupos = async () => {
  const respuesta = await get('/obtener_grupos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  grupos.value = respuesta.objetos.map((obj: GroupObject) => obj.descripcion);
};

const obtenerLugaresTrabajo = async () => {
  const respuesta = await get('/obtener_lugar_empleado', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  const data: Lugar[] = respuesta.objetos;
  groups.value = [...new Set(data.map((item) => item.lugares))];
};

const obtenerEmpleado = async (model: string) => {
  const respuesta = await get('/obtener_empleado', { departamento: model });
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

const empleadosAsignados = ref<number[]>([]);

const obtenerEmpleadoAsignado = async () => {
  const respuesta: RespuestaEmpleados = await get(
    '/obtener_empleado_asignado',
    {}
  );
  if (respuesta.error === 'N') {
    empleadosAsignados.value = respuesta.objetos.map((el) => el.usuario_codigo);
  }
  if (respuesta.error === 'S') {
    empleadosAsignados.value = [];
  }
};

const reloadTable = (model: string) => {
  obtenerGrupos();
  obtenerEmpleado(model);
  obtenerEmpleadoAsignado();
};

const handleButtonClicked = async (id: number, selected: Empleados[]) => {
  for (const item of selected) {
    await designar_lugar_empleado(id, item.codigo);
  }
};

const obtenerEmpleadosAsignados = async (modelo: string) => {
  const respuesta = await get('/obtener_empleados_asignados', {
    lugar: modelo,
  });
  if (respuesta.error === 'S') {
    zeile.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    zeile.value = [];
  } else {
    zeile.value = respuesta.objetos;
  }
};

const obtenerAlmacenes = async () => {
  const respuesta = await get('/obtener_almacenes', {});
  if (respuesta.error === 'S') {
    rows.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    rows.value = [];
  } else {
    rows.value = respuesta.objetos;
  }
};

watch(model, (newValue) => {
  // Call the obtenerEmpleado function with the new value of 'model'
  obtenerEmpleado(newValue);
});

const openGoogleMaps = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  window.open(mapsUrl, '_blank');
};

const obtenerCoordenadas = async (id: number) => {
  const respuesta = await get('/obtener_coordenadas', { alm_codigo: id });
  if (respuesta.error === 'S') {
    checked.value = true;
    toogle.value = false;
  }

  // Check if the response contains data
  if (respuesta.objetos.length !== 0) {
    checked.value = false;
    toogle.value = true;
  }
};

const obtenerLugares = async () => {
  const respuesta = await get('/obtener_lugares', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
  }

  // Check if the response contains data
  if (respuesta.objetos.length !== 0) {
    lugares.value = respuesta.objetos;
  }
};

onMounted(() => {
  obtenerLugares(); // Call the function when the component is mounted
});

const registrarCoordenadas = async (
  targetId: number,
  targetCoordinates: string
) => {
  const [targetLatitude, targetLongitude] = targetCoordinates
    .split(',')
    .map((coord) => parseFloat(coord.trim()));
  try {
    const response = await post(
      '/registrar_coordenadas',
      {},
      JSON.parse(
        JSON.stringify({
          alm_codigo: targetId,
          lat: targetLatitude,
          long: targetLongitude,
        })
      )
    );

    if (response.error === 'N') {
      // check.value = true;
      text.value = ' ';
    }
    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando las coordenadas:', error);
  }
};

const actualizarCoordenadas = async (
  targetId: number,
  targetCoordinates: string
) => {
  const [targetLatitude, targetLongitude] = targetCoordinates
    .split(',')
    .map((coord) => parseFloat(coord.trim()));
  try {
    const response = await put(
      '/actualizar_coordenadas',
      {},
      JSON.parse(
        JSON.stringify({
          alm_codigo: targetId,
          lat: targetLatitude,
          long: targetLongitude,
        })
      )
    );

    if (response.error === 'N') {
      // check.value = true;
      text.value = ' ';
    }
    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando las coordenadas:', error);
  }
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

const getCalles = (lugar: string) => {
  if (lugar === '' || lugar === null) {
    direccion.value = '';
    id_direccion.value = 0;
  } else {
    const calles = lugares.value.find((l) => l.alm_nomcom === lugar);
    direccion.value = calles.alm_calles;
    id_direccion.value = calles.codigo;
  }
};

watch(lugar, () => {
  getCalles(lugar.value);
});
</script>

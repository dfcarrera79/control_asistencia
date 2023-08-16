<template>
  <div class="q-pa-md">
    <div>
      <h4
        class="row text-uppercase text-grey-8 justify-center content-center"
        style="font-family: 'Bebas Neue'"
      >
        <div class="q-pt-sm">GESTIÓN DE USUARIOS</div>
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
            @click="
              obtenerGrupos();
              obtenerEmpleado(model);
            "
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
              <q-scroll-area style="height: 550px">
                <q-table
                  square
                  flat
                  bordered
                  hide-bottom
                  :rows="filas"
                  :filter="filter"
                  :columns="columnas"
                  row-key="codigo"
                  class="text-h6 text-grey-8"
                  :rows-per-page-options="[0]"
                  v-model:pagination="pagination"
                  :visible-columns="columnasVisibles"
                >
                  <template v-slot:top>
                    <div class="column">
                      <p
                        class="text-h6 text-grey-8"
                        style="font-family: 'Bebas Neue'"
                      >
                        EMPLEADOS
                      </p>

                      <div class="row justify-left">
                        <q-select
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

                        <q-input
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
                  </template>

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
                            obtenerLugares();
                            obtenerEmpleadoAsignado(props.row.codigo);
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
                            v-model="checked2"
                            v-if="toogle2"
                            label="Editar asignación de lugar de trabajo"
                          />
                          <div class="column justify-start" v-if="checked2">
                            <strong>Dirección: </strong>
                            {{ direccion }}
                            <div
                              class="q-gutter-y-md column"
                              style="max-width: 300px"
                            >
                              <q-select
                                dense
                                clearable
                                filled
                                color="primary"
                                v-model="lugar"
                                :options="
                                  lugares.map((lugar) => lugar.alm_nomcom)
                                "
                                label="Lugares"
                              />

                              <q-btn
                                dense
                                @click="
                                  designar_lugar_empleado(
                                    id_direccion,
                                    props.row.codigo
                                  )
                                "
                                label="Asignar lugar de trabajo"
                                outline
                                color="primary"
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

          <q-tab-panel name="grupos">
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
                  <template v-slot:top>
                    <p
                      class="text-h6 text-grey-8"
                      style="font-family: 'Bebas Neue'"
                    >
                      LUGARES DE TRABAJO
                    </p>

                    <q-space />

                    <q-input
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
                  </template>

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
                  <template v-slot:top>
                    <div class="column">
                      <p
                        class="text-h6 text-grey-8"
                        style="font-family: 'Bebas Neue'"
                      >
                        EMPLEADOS ASIGNADOS A LUGARES DE TRABAJO
                      </p>
                      <div class="row justify-left">
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

                        <q-input
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

                    <!-- <q-space />

                    <q-input
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
                    </q-input> -->
                  </template>
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
import { ref, watch } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import {
  GroupObject,
  FilasEmpleados,
  FilasAlmacenes,
  Lugares,
  FilasAsignados,
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

const checked2 = ref(false);
const toogle2 = ref(false);

const columnasVisibles = ref([
  'id',
  'nombre',
  'cargo',
  'telefono',
  'celular',
  'email',
  'departamento',
]);

const direccion = ref('');
const id_direccion = ref(0);

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
  const data = respuesta.objetos;
  groups.value = [...new Set(data.map((item) => item.lugares))];
};

const obtenerEmpleado = async (model: string) => {
  const respuesta = await get('/obtener_empleado', { departamento: model });
  if (respuesta.error === 'S') {
    filas.value = [];
    return;
  }
  // filas.value = respuesta.objetos;

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    filas.value = [];
  } else {
    filas.value = respuesta.objetos;
  }
};

const obtenerEmpleadoAsignado = async (id: number) => {
  const respuesta = await get('/obtener_emplado_asignado', { codigo: id });
  if (respuesta.error === 'S') {
    checked2.value = true;
    toogle2.value = false;
  }

  // Check if the response contains data
  if (respuesta.objetos.length !== 0) {
    checked2.value = false;
    toogle2.value = true;
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
  // filas.value = respuesta.objetos;

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
    id_direccion.value = calles.alm_codigo;
  }
};

watch(lugar, () => {
  getCalles(lugar.value);
});
</script>

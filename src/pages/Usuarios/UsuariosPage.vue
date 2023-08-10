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
            name="perfiles"
            label="Perfiles de Usuarios"
            @click="
              obtenerGrupos();
              obtenerEmpleado(model);
            "
          />
          <q-tab name="roles" label="Roles y Permisos" />
          <q-tab name="grupos" label="Asignación a Grupos" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="perfiles">
            <div class="q-pa-md">
              <q-scroll-area style="height: 500px">
                <q-table
                  square
                  flat
                  bordered
                  hide-bottom
                  :rows="filas"
                  :filter="filter"
                  :columns="columnas"
                  row-key="cedula_ruc"
                  class="text-h6 text-grey-8"
                  :rows-per-page-options="[0]"
                  v-model:pagination="pagination"
                  :visible-columns="visibleColumns"
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
                          label="Grupos"
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
                </q-table>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="roles">
            <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
              Roles
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="grupos">
            <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
              Grupos
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { GroupObject, FilasEmpleados } from '../../components/models';

// Data
const tab = ref('');
const { get } = useAxios();
const grupos = ref([]);
const model = ref('');

const filas = ref<FilasEmpleados[]>([]);
const filter = ref('');
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

const visibleColumns = ref([
  'id',
  'nombre',
  'cargo',
  'telefono',
  'celular',
  'email',
  'departamento',
]);

const columnas: QTableProps['columns'] = [
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

watch(model, (newValue) => {
  // Call the obtenerEmpleado function with the new value of 'model'
  obtenerEmpleado(newValue);
});
</script>

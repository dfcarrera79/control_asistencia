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
            @click="
              obtenerAlmacenes();
              obtenerLugaresAsignados();
            "
          />
          <q-tab
            name="perfiles"
            label="Asignación de Lugares de Trabajo"
            @click="actualizarFilas(model)"
          />
          <q-tab
            name="lugares"
            label="Lista de empleados asignados"
            @click="
              obtenerEmpleadosAsignados(modelo);
              obtenerLugaresTrabajo();
            "
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="grupos">
            <LugaresTrabajoComponent
              :rows="rows"
              :lugaresAsignados="lugaresAsignados"
              @actualizarLugares="actualizarLugares()"
            />
          </q-tab-panel>

          <q-tab-panel name="perfiles">
            <AsignacionLugaresComponent
              :filas="filas"
              :grupos="grupos"
              :lugares="lugares"
              :direcciones="direcciones"
              :empleadosAsignados="empleadosAsignados"
              @actualizarFilas="actualizarFilas($event)"
            />
          </q-tab-panel>

          <q-tab-panel name="lugares">
            <EmpleadosAsignadosComponent
              :zeile="zeile"
              :groups="groups"
              @updateRows="updateRows($event)"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
import LugaresTrabajoComponent from './LugaresTrabajoComponent.vue';
import EmpleadosAsignadosComponent from './EmpleadosAsignadosComponent.vue';
import AsignacionLugaresComponent from './AsignacionLugaresComponent.vue';
import {
  GroupObject,
  FilasEmpleados,
  FilasAlmacenes,
  Lugar,
  Lugares,
  FilasAsignados,
  RespuestaEmpleados,
  RespuestaLugares,
} from '../../components/models';

// Data
const tab = ref('');
const { get } = useAxios();
const grupos = ref([]);
const groups = ref<string[]>([]);
const model = ref('');
const modelo = ref('');
const filas = ref<FilasEmpleados[]>([]);
const rows = ref<FilasAlmacenes[]>([]);
const zeile = ref<FilasAsignados[]>([]);
const lugares = ref<string[]>([]);
const direcciones = ref<Lugares[]>([]);

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

const lugaresAsignados = ref<number[]>([]);

const obtenerLugaresAsignados = async () => {
  const respuesta: RespuestaLugares = await get('/obtener_lugares_asignados', {
    usuario_codigo: 1,
  });
  if (respuesta.error === 'N') {
    lugaresAsignados.value = respuesta.objetos.map((el) => el.alm_codigo);
  }
  if (respuesta.error === 'S') {
    lugaresAsignados.value = [];
  }
};

const actualizarLugares = () => {
  obtenerLugaresAsignados();
};

const actualizarFilas = (event: string) => {
  obtenerGrupos();
  obtenerLugares();
  obtenerEmpleado(event);
  obtenerEmpleadoAsignado();
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

const obtenerLugares = async () => {
  const respuesta: RespuestaLugares = await get('/obtener_lugares', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
  }

  // Check if the response contains data
  if (respuesta.objetos.length !== 0) {
    lugares.value = respuesta.objetos.map((lugar) => lugar.alm_nomcom);
    direcciones.value = respuesta.objetos;
  }
};

const updateRows = (event: string): void => {
  obtenerEmpleadosAsignados(event);
};
</script>

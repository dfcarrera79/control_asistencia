<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
// import HorariosComponent from './HorariosComponent.vue';
import AsignadosComponent from './AsignadosComponent.vue';
import NuevoHorarioComponent from './NuevoHorarioComponent.vue';
import NuevoAsignacionComponent from './NuevoAsignacionComponent.vue';
// import AsignacionComponent from './AsignacionComponent.vue';
// import CalendarioComponent from './CalendarioComponent.vue';
// import NuevoHorario from './NuevoHorario.vue';
import {
  Evento,
  GroupObject,
  LugarTrabajo,
  RespuestaHorario,
  HorariosAsignados,
} from '../../components/models';

// Data
const tab = ref('');
const lugar = ref('');
const departamento = ref('');
const mes = ref('');
const anio = ref('');
const modelo = ref({
  lugar: lugar.value,
  departamento: departamento.value,
  mes: mes.value,
  anio: anio.value,
});
const grupos = ref([]);
const groups = ref<string[]>([]);
// const schedules = ref<Schedule[]>([]);
// const rows = ref<FilasHorarios[]>([]);
const filas = ref<HorariosAsignados[]>([]);
const horarios = ref<RespuestaHorario[]>([]);
const { get } = useAxios();

// Methods
const obtenerGrupos = async () => {
  const respuesta = await get('/obtener_grupos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  grupos.value = respuesta.objetos.map((obj: GroupObject) => obj.descripcion);
};

const obtenerHorarios = async () => {
  const respuesta = await get('/obtener_horarios', {});
  if (respuesta.error === 'S') {
    horarios.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    horarios.value = [];
  } else {
    horarios.value = respuesta.objetos;
  }
};

const actualizarHorarios = (): void => {
  obtenerHorarios();
};

const obtenerHorariosAsignados = async (evento: Evento) => {
  const respuesta = await get('/obtener_horarios_asignados', {
    lugar: evento.lugar,
    departamento: evento.departamento,
    mes: evento.mes,
    anio: evento.anio,
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

const actualizarFilas = (event: Evento): void => {
  obtenerHorariosAsignados(event);
};

const obtenerLugaresTrabajo = async () => {
  const respuesta = await get('/obtener_lugar_horario', {});
  if (respuesta.error === 'S') {
    return;
  }
  const data: LugarTrabajo[] = respuesta.objetos;
  groups.value = [...new Set(data.map((item) => item.alm_nomcom))];
};

const handleAsignacion = () => {
  obtenerGrupos();
  obtenerHorarios();
};

const handleVisualizacion = (model: Evento) => {
  obtenerGrupos();
  obtenerLugaresTrabajo();
  obtenerHorariosAsignados(model);
};
</script>

<template>
  <div class="q-pt-sm">
    <h4
      class="row text-uppercase justify-center content-center q-my-sm q-pb-md"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-sm">CONFIGURACIÓN DE HORARIOS</div>
    </h4>
  </div>

  <div class="q-gutter-y-sm">
    <q-card flat>
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        style="font-family: 'Oswald'"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="horarios"
          label="Creación de Horarios"
          @click="obtenerHorarios()"
        />
        <q-tab
          name="asignacion"
          label="Asignación de Horarios a Grupos"
          @click="handleAsignacion()"
        />
        <q-tab
          name="visualizacion"
          label="Visualización de Horarios Asignados"
          @click="handleVisualizacion(modelo)"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="horarios">
          <!-- <HorariosComponent :rows="rows" @updateRows="updateRows()" /> -->
          <NuevoHorarioComponent
            :horarios="horarios"
            @actualizarHorarios="actualizarHorarios()"
          />
        </q-tab-panel>

        <q-tab-panel name="asignacion">
          <!-- <AsignacionComponent /> -->
          <NuevoAsignacionComponent :grupos="grupos" :schedules="horarios" />
        </q-tab-panel>

        <q-tab-panel name="visualizacion">
          <AsignadosComponent
            :filas="filas"
            :grupos="grupos"
            :groups="groups"
            @updateRows="actualizarFilas($event)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<style lang="scss" scoped></style>

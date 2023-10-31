<template>
  <div class="q-pt-sm">
    <h4
      class="row text-uppercase text-grey-8 justify-center content-center q-my-sm q-pb-md"
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
        class="bg-grey-2 text-grey-9"
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
        <q-tab name="asignacion" label="Asignación de Horarios a Grupos" />
        <q-tab
          name="visualizacion"
          label="Visualización de Horarios Asignados"
          @click="
            obtenerHorariosAsignados(modelo);
            obtenerLugaresTrabajo();
          "
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="horarios">
          <HorariosComponent :rows="rows" @updateRows="updateRows()" />
        </q-tab-panel>

        <q-tab-panel name="asignacion">
          <AsignacionComponent />
        </q-tab-panel>

        <q-tab-panel name="visualizacion">
          <AsignadosComponent
            :filas="filas"
            :groups="groups"
            @updateRows="actualizarFilas($event)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
import HorariosComponent from './HorariosComponent.vue';
import AsignadosComponent from './AsignadosComponent.vue';
import AsignacionComponent from './AsignacionComponent.vue';
import {
  FilasHorarios,
  HorariosAsignados,
  LugarTrabajo,
} from '../../components/models';

// Data
const tab = ref('');
const modelo = ref('');
const groups = ref<string[]>([]);
const rows = ref<FilasHorarios[]>([]);
const filas = ref<HorariosAsignados[]>([]);
const { get } = useAxios();

// Methods
const obtenerHorarios = async () => {
  const respuesta = await get('/obtener_turnos', {});
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

const updateRows = (): void => {
  obtenerHorarios();
};

const obtenerHorariosAsignados = async (modelo: string) => {
  const respuesta = await get('/obtener_horarios_asignados', {
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

const actualizarFilas = (event: string): void => {
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
</script>

<style lang="scss" scoped></style>

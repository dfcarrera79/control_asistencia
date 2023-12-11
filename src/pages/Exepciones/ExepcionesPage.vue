<template>
  <div class="q-pt-sm">
    <h4
      class="row text-uppercase justify-center content-center q-my-sm q-pb-md"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-sm">GESTIÓN DE EXEPCIONES</div>
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
          name="registro"
          label="Registro de Excepciones"
          @click="obtenerEmpleadosAsignados()"
        />
        <q-tab
          name="autorizacion"
          label="Autorización de Excepciones"
          @click="obtenerExcepciones()"
        />
        <q-tab
          name="historial"
          label="Historial de Excepciones"
          @click="
            obtenerExcepcionesAutorizadas($event.eventDesde, $event.eventHasta)
          "
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="registro">
          <RegistroComponent :filas="filas" />
        </q-tab-panel>

        <q-tab-panel name="autorizacion">
          <AutorizacionComponent :rows="rows" @updateRows="updateRows()" />
        </q-tab-panel>

        <q-tab-panel name="historial">
          <AutorizadosComponent
            :zeilen="zeilen"
            @updateRows="actualizarFilas($event.eventDesde, $event.eventHasta)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
import RegistroComponent from './RegistroComponent.vue';
import AutorizacionComponent from './AutorizacionComponent.vue';
import AutorizadosComponent from './AutorizadosComponent.vue';
import {
  EmpleadosAsignados,
  Excepciones,
  Autorizados,
} from '../../components/models';

// Data
const tab = ref('');
const filas = ref<EmpleadosAsignados[]>([]);
const rows = ref<Excepciones[]>([]);
const zeilen = ref<Autorizados[]>([]);
const { get } = useAxios();

// Methods
const obtenerEmpleadosAsignados = async () => {
  const respuesta = await get('/obtener_empleados_lugares', {});
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

const obtenerExcepciones = async () => {
  const respuesta = await get('/obtener_excepciones', {});
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

const obtenerExcepcionesAutorizadas = async (desde: string, hasta: string) => {
  const respuesta = await get('/obtener_excepciones_autorizadas', {
    desde: desde,
    hasta: hasta,
  });
  if (respuesta.error === 'S') {
    zeilen.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    zeilen.value = [];
  } else {
    zeilen.value = respuesta.objetos;
  }
};

const updateRows = (): void => {
  obtenerExcepciones();
};

const actualizarFilas = (eventDesde: string, eventHasta: string): void => {
  obtenerExcepcionesAutorizadas(eventDesde, eventHasta);
};
</script>

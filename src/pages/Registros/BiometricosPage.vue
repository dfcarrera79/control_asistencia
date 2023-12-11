<template>
  <div class="q-pt-sm">
    <h4
      class="row text-uppercase justify-center content-center q-my-sm q-pb-md"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-sm">Registros biométricos</div>
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
          name="celulares"
          label="Registros de ids celulares"
          @click="actualizarFilas(model)"
        />
        <q-tab
          name="fotos"
          label="Registros de fotos"
          @click="updateRows(model)"
        />
        <q-tab
          name="registros"
          label="Registros anulados"
          @click="updateZeile(model)"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="celulares">
          <CelularesComponent
            :filas="filas"
            :grupos="grupos"
            @actualizarFilas="actualizarFilas($event)"
          />
        </q-tab-panel>

        <q-tab-panel name="fotos">
          <FotosComponent
            :filas="rows"
            :grupos="grupos"
            @updateRows="updateRows($event)"
          />
        </q-tab-panel>
        <q-tab-panel name="registros">
          <RegistrosComponent
            :filas="zeile"
            :grupos="grupos"
            @updateZeile="updateZeile($event)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
import {
  FilasDispositivos,
  FilasAnulados,
  FilasFotos,
  GroupObject,
} from '../../components/models';
import FotosComponent from './FotosComponent.vue';
import RegistrosComponent from './RegistrosComponent.vue';
import CelularesComponent from './CelularesComponent.vue';

// Data
const tab = ref('');
const grupos = ref([]);
const model = ref('');
const rows = ref<FilasFotos[]>([]);
const filas = ref<FilasDispositivos[]>([]);
const zeile = ref<FilasAnulados[]>([]);
const { get } = useAxios();

// Methods
const obtenerDispositivos = async (model: string) => {
  const respuesta = await get('/obtener_dispositivos', { departamento: model });
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

const obtenerFotos = async (model: string) => {
  const respuesta = await get('/obtener_fotos', { departamento: model });
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

const obtenerRegistrosAnulados = async (model: string) => {
  const respuesta = await get('/obtener_anulados', { departamento: model });
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

const obtenerGrupos = async () => {
  const respuesta = await get('/obtener_grupos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  grupos.value = respuesta.objetos.map((obj: GroupObject) => obj.descripcion);
};

const actualizarFilas = (event: string) => {
  obtenerGrupos();
  obtenerDispositivos(event);
};

const updateRows = (event: string) => {
  obtenerGrupos();
  obtenerFotos(event);
};

const updateZeile = (event: string) => {
  obtenerGrupos();
  obtenerRegistrosAnulados(event);
};
</script>

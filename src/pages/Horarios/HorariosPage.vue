<template>
  <div>
    <h4
      class="row text-uppercase text-grey-8 justify-center content-center"
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
          <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
            Visualización de Horarios
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAxios } from '../../services/useAxios';
import HorariosComponent from './HorariosComponent.vue';
import AsignacionComponent from './AsignacionComponent.vue';
import { FilasHorarios } from '../../components/models';

// Data
const tab = ref('');
const rows = ref<FilasHorarios[]>([]);

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
</script>

<style lang="scss" scoped></style>

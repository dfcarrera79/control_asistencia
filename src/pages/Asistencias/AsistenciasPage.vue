<script setup lang="ts">
import { ref } from 'vue';

import AsistenciasComponent from './AsistenciasComponent.vue';
import ConsolidarMesComponent from './ConsolidarMesComponent.vue';
import AsistenciasCalculadasComponent from './AsistenciasCalculadasComponent.vue';

// Data
const tab = ref('');
</script>

<template>
  <div class="q-pt-sm">
    <h4
      class="row text-uppercase justify-center content-center q-my-sm q-pb-md"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-sm">REGISTRO DE ASISTENCIAS</div>
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
        <q-tab name="registros" label="Asistencias y atrasos por Usuario" />
        <q-tab name="horas" label="Registros de horas trabajadas" />
        <q-tab name="atrasos" label="Consolidación por mes" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="horas">
          <AsistenciasCalculadasComponent />
        </q-tab-panel>
        <q-tab-panel name="registros">
          <AsistenciasComponent />
        </q-tab-panel>
        <q-tab-panel name="atrasos">
          <ConsolidarMesComponent />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

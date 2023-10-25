<template>
  <div>
    <h4
      class="row text-uppercase text-grey-8 justify-center content-center"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-sm">Horas suplementarias</div>
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
        <q-tab name="horas" label="Registro de horas suplementarias" />
        <q-tab name="registros" label="Visualización de registros" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="horas">
          <HoraSuplementariaComponent />
        </q-tab-panel>

        <q-tab-panel name="registros">
          <RegistrosComponent />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HoraSuplementariaComponent from './HoraSuplementariaComponent.vue';
import RegistrosComponent from './RegistrosComponent.vue';

// Datos
const tab = ref('');
</script>

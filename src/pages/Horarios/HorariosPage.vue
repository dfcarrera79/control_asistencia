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
        <q-tab name="horarios" label="Creación de Horarios" />
        <q-tab name="asignacion" label="Asignación de Horarios a Grupos" />
        <q-tab name="visualizacion" label="Visualización de Horarios" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="horarios">
          <HorariosComponent />
        </q-tab-panel>

        <q-tab-panel name="asignacion">
          <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
            Asignación de Horarios
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
import HorariosComponent from './HorariosComponent.vue';

// Data
const tab = ref('');
</script>

<style lang="scss" scoped></style>

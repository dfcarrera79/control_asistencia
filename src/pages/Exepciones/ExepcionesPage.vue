<template>
  <div>
    <h4
      class="row text-uppercase text-grey-8 justify-center content-center"
      style="font-family: 'Bebas Neue'"
    >
      <div class="q-pt-md">GESTIÓN DE EXEPCIONES</div>
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
        <q-tab name="registro" label="Registro de Excepciones" />
        <q-tab name="autorizacion" label="Autorización de Excepciones" />
        <q-tab name="historial" label="Historial de Excepciones" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="registro">
          <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
            Registro
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="autorizacion">
          <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
            Autorización
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="historial">
          <div class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
            Historial
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Data
const tab = ref('');
</script>

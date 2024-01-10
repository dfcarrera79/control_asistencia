<script setup lang="ts">
import { ref, watch } from 'vue';
import { FilasAnulados } from '../../components/models';
import { columnasRegistrosBio } from '../../components/columns';

/* Defined Props */
const props = defineProps<{
  filas: FilasAnulados[];
  grupos: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateZeile']);

// Data
const filter = ref('');
const modelo = ref('');
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const columnas = columnasRegistrosBio;
const visibleColumns = ref(['nombre', 'departamento', 'registro', 'anulado']);

// Methods
const enviarDepartamento = (event: string) => {
  emit('updateZeile', event);
};

watch(modelo, (newValue) => {
  enviarDepartamento(newValue);
});
</script>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6" style="font-family: 'Bebas Neue'">
        REGISTROS ANULADOS
      </p>
      <div class="row justify-left">
        <q-input
          outlined
          input-class="text-right"
          clearable
          clear-icon="close"
          dense
          debounce="350"
          borderless
          color="primary"
          v-model="filter"
          placeholder="Buscar..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="q-pl-md">
          <q-select
            class="q-px-md"
            outlined
            dense
            v-model="modelo"
            :options="props.grupos"
            label="Departamentos"
            style="width: 200px"
          >
            <template v-if="modelo" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="modelo = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <q-table
      square
      flat
      bordered
      hide-bottom
      :filter="filter"
      :rows="props.filas"
      :columns="columnas"
      :visible-columns="visibleColumns"
      row-key="codigo"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
    />
  </div>
</template>

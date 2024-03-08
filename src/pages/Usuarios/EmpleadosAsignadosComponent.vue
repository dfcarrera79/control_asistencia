<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import { FilasAsignados } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  zeile: FilasAsignados[];
  groups: string[];
  grupos: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const filter = ref('');
const modelo = ref('');
const departamento = ref('');
const opciones = ref(props.groups);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const spalte: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Cédula/Ruc', field: 'cedula_ruc' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'lugar',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
  {
    name: 'direccion',
    align: 'left',
    label: 'Dirección del lugar de trabajo',
    field: 'direccion',
  },
];

// Methods
const filtroFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      opciones.value = props.groups;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opciones.value = props.groups.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const enviarLyD = (lugar: string, departamento: string) => {
  emit('updateRows', { lugar, departamento });
};

watch([modelo, departamento], ([newModelo, newDepartamento]) => {
  enviarLyD(newModelo, newDepartamento);
});
</script>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6" style="font-family: 'Bebas Neue'">
        EMPLEADOS ASIGNADOS A LUGARES DE TRABAJO
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

        <div>
          <q-select
            class="q-px-md"
            outlined
            dense
            v-model="departamento"
            :options="props.grupos"
            label="Departamentos"
            style="width: 200px"
          >
            <template v-if="departamento" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="departamento = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>

        <q-separator vertical />

        <div class="q-pl-md">
          <q-select
            dense
            filled
            v-model="modelo"
            use-input
            hide-selected
            fill-input
            input-debounce="300"
            label="Lugares asignados"
            :options="opciones"
            @filter="filtroFn"
            style="width: 250px"
          >
            <template v-if="modelo" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="modelo = ''"
                class="cursor-pointer"
              />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section> No hay resultados </q-item-section>
              </q-item>
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
      :rows="props.zeile"
      :columns="spalte"
      :filter="filter"
      row-key="cedula_ruc"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
    />
  </div>
</template>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

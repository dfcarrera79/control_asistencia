<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
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
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
    </div>

    <q-scroll-area style="height: 550px">
      <q-table
        square
        flat
        bordered
        hide-bottom
        :rows="props.zeile"
        :columns="spalte"
        :filter="filter"
        row-key="cedula_ruc"
        class="text-h6 text-grey-8"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
      >
      </q-table>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import { FilasAsignados } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  zeile: FilasAsignados[];
  groups: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const filter = ref('');
const modelo = ref('');
// const groups = ref<string[]>([]);
const opciones = ref(props.groups);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const spalte: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Cedula/Ruc', field: 'cedula_ruc' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
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

const enviarLugar = (event: string) => {
  emit('updateRows', event);
};

watch(modelo, (newValue) => {
  enviarLugar(newValue);
});
</script>

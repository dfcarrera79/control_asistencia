<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <div class="row">
        <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
          Autorización
        </p>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="updateRows()"
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
            >
              <strong class="text-caption">Actualizar tabla</strong>
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="row justify-left items-center">
        <div class="q-pt-xs q-pr-md">
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
        </div>

        <q-separator vertical />

        <div class="q-pt-xs q-pl-md">
          <q-btn
            unelevated
            color="positive"
            :label="
              selected.length == 1
                ? 'Autorizar exepcion'
                : 'Autorizar exepciones'
            "
            icon="do_not_disturb_on"
            @click="handleButtonClicked(selected, authStore.getCodigo)"
            :disable="selected.length == 0"
          />
        </div>
      </div>
    </div>

    <q-table
      square
      flat
      bordered
      hide-bottom
      :rows="props.rows"
      :columns="columns"
      :filter="filter"
      row-key="usuario_codigo"
      class="my-sticky-header-table text-h6 text-grey-8"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      selection="multiple"
      v-model:selected="selected"
    >
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from 'src/stores/auth';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from 'src/services/useAxios';
import { Excepciones } from '../../components/models';
import { formatearFechas } from 'src/services/useWorkDays';

/* Defined Props */
const props = defineProps<{
  rows: Excepciones[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const $q = useQuasar();
const filter = ref('');
const selected = ref([]);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const { put } = useAxios();
const authStore = useAuthStore();
const columns: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'usuario_codigo' },
  {
    name: 'nombre_completo',
    align: 'left',
    label: 'Nombre',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'alm_nomcom',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
  {
    name: 'excepcion',
    align: 'left',
    label: 'Tipo de exepcion',
    field: 'excepcion',
  },
  {
    name: 'dias',
    align: 'left',
    label: 'Dias de exepcion',
    field: (row) => formatearFechas(row.dias),
  },
];
const visibleColumns = ref([
  'nombre_completo',
  'alm_nomcom',
  'excepcion',
  'dias',
]);

// Methods
const autorizarExcepcion = async (
  usuario_codigo: number,
  autorizado_por: number
) => {
  try {
    const response = await put(
      '/autorizar_exepcion',
      {},
      JSON.parse(
        JSON.stringify({
          usuario_codigo: usuario_codigo,
          autorizado_por: autorizado_por,
        })
      )
    );

    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error autorizando la exepción:', error);
  }
};

const resetVariables = () => {
  filter.value = '';
  selected.value = [];
};

const updateRows = () => {
  emit('updateRows');
};

const handleButtonClicked = async (
  selected: Excepciones[],
  autorizado_por: number
) => {
  for (const item of selected) {
    await autorizarExcepcion(item.usuario_codigo, autorizado_por);
  }
  resetVariables();
  updateRows();
};
</script>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

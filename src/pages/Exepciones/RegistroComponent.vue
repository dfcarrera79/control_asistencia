<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { EmpleadosAsignados } from '../../components/models';
import { columnasRegistrosExepciones } from '../../components/columns';

/* Defined Props */
const props = defineProps<{
  filas: EmpleadosAsignados[];
}>();

// Data
const $q = useQuasar();
const filter = ref('');
const modelo = ref<string[]>([]);
const selected = ref([]);
const stringOptions = ['Vacaciones', 'Días festivos', 'Consulta médica'];
const filterOptions = ref(stringOptions);
const dias = ref([]);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const { post } = useAxios();
const columns = columnasRegistrosExepciones;
const visibleColumns = ref(['nombre_completo', 'alm_nomcom']);

// Methods
const createValue = (val: string, done) => {
  if (val.length > 2) {
    if (!stringOptions.includes(val)) {
      done(val, 'add-unique');
    }
  }
};

const filterFn = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = stringOptions.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const registrarExepcion = async (
  usuario_codigo: number,
  excepcion: string,
  dias: string[]
) => {
  try {
    const response = await post(
      '/registrar_exepcion',
      {},
      JSON.parse(
        JSON.stringify({
          usuario_codigo: usuario_codigo,
          excepcion: excepcion,
          dias: dias,
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
    console.error('Error registrando la exepción:', error);
  }
};

const resetVariables = () => {
  filter.value = '';
  modelo.value = [];
  selected.value = [];
  dias.value = [];
};

const handleButtonClicked = async (
  selected: EmpleadosAsignados[],
  excepcion: string[],
  dias: string[]
) => {
  for (const item of selected) {
    await registrarExepcion(item.usuario_codigo, excepcion[0], dias);
  }
  resetVariables();
};
</script>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6" style="font-family: 'Bebas Neue'">Exepciones</p>

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

        <div class="q-pt-xs q-px-md">
          <q-select
            filled
            dense
            label="Excepciones"
            v-model="modelo"
            use-input
            use-chips
            multiple
            input-debounce="0"
            @new-value="createValue"
            :options="filterOptions"
            @filter="filterFn"
            style="width: 250px"
          />
        </div>

        <div class="q-pt-sm" style="max-width: 350px">
          <q-btn-dropdown
            no-caps
            outline
            unelevated
            color="primary"
            icon="date_range"
            label="Seleccionar días"
          >
            <q-date v-model="dias" multiple minimal />
          </q-btn-dropdown>
        </div>

        <div class="q-pt-sm q-pl-md">
          <q-btn
            unelevated
            color="positive"
            :label="
              selected.length == 1 ? 'Asignar excepción' : 'Asignar excepciones'
            "
            icon="do_not_disturb_on"
            @click="handleButtonClicked(selected, modelo, dias)"
            :disable="
              selected.length == 0 || dias.length == 0 || modelo.length == 0
            "
          />
        </div>
      </div>
    </div>

    <div class="column justify-left q-pl-md q-pt-md">
      <strong class="text-weight-medium"
        >Días seleccionados: {{ dias }}
      </strong>
    </div>

    <q-table
      square
      flat
      bordered
      hide-bottom
      :rows="props.filas"
      :columns="columns"
      :filter="filter"
      row-key="usuario_codigo"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      selection="multiple"
      v-model:selected="selected"
    >
    </q-table>
  </div>
</template>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
        Exepciones
      </p>

      <div class="row justify-left">
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
            label="Exepciones"
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

        <div style="max-width: 350px">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="date_range"
              label="Seleccionar dias"
              header-class="text-grey-8"
            >
              <div class="q-pa-md">
                <q-date v-model="dias" multiple />
              </div>
            </q-expansion-item>
          </q-list>
        </div>

        <div class="q-pt-xs q-pl-md">
          <q-btn
            color="positive"
            :label="
              selected.length == 1 ? 'Asignar exepcion' : 'Asignar exepciones'
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
      <strong class="text-weight-medium text-grey-8"
        >Días seleccionados: {{ dias }}
      </strong>
    </div>

    <q-scroll-area style="height: 550px">
      <q-table
        square
        flat
        bordered
        hide-bottom
        :rows="props.filas"
        :columns="columns"
        :filter="filter"
        row-key="usuario_codigo"
        class="text-h6 text-grey-8"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="visibleColumns"
        selection="multiple"
        v-model:selected="selected"
      >
      </q-table>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { EmpleadosAsignados } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  filas: EmpleadosAsignados[];
}>();

// Data
const $q = useQuasar();
const filter = ref('');
const modelo = ref(null);
const selected = ref([]);
const stringOptions = ['Vacaciones', 'Días festivos', 'Consulta médica'];
const filterOptions = ref(stringOptions);
const dias = ref([]);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const { post } = useAxios();
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
];
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

    if (response.error === 'N') {
      console.log('[RESPONSE]: ', response);
    }
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
  modelo.value = null;
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

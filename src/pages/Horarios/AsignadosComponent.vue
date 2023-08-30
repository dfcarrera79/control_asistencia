<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
        EMPLEADOS ASIGNADOS A HORARIOS
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
            :options="opcions"
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
        :rows="props.filas"
        :columns="columns"
        :filter="filter"
        row-key="cedula_ruc"
        class="text-h6 text-grey-8"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="visibleColumns"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nombre_completo" :props="props">
              {{ props.row.nombre_completo }}
            </q-td>
            <q-td key="alm_nomcom" :props="props">
              {{ props.row.alm_nomcom }}
            </q-td>
            <q-td key="direccion" :props="props">
              {{ props.row.direccion }}
            </q-td>
            <q-td key="dias" :props="props">
              {{ getSortedWorkDays(props.row) }}
            </q-td>
            <q-td key="horario_1" :props="props">
              {{
                `${formatTimeRange(props.row.horario_1)} ${formatTimeRange(
                  props.row.horario_2
                )}`
              }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import { getSortedWorkDays } from '../../services/useWorkDays';
import { HorariosAsignados } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  filas: HorariosAsignados[];
  groups: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const filter = ref('');
const modelo = ref('');
const opcions = ref(props.groups);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const columns: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'codigo' },
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
    name: 'direccion',
    align: 'left',
    label: 'Dirección del lugar de trabajo',
    field: 'direccion',
  },
  {
    name: 'dias',
    align: 'left',
    label: 'Dias de trabajo',
    field: 'dias_trabajados',
  },
  {
    name: 'horario_1',
    align: 'left',
    label: 'Horario',
    field: 'horario_1',
  },
  {
    name: 'horario_2',
    align: 'left',
    label: 'Horario 2',
    field: 'horario_2',
  },
];
const visibleColumns = ref([
  'nombre_completo',
  'alm_nomcom',
  'direccion',
  'dias',
  'horario_1',
]);

// Methods
const formatTimeRange = (timeRangeString: string) => {
  if (timeRangeString === null) {
    return '';
  }
  const [startTime, endTime] = timeRangeString.split(' ');
  const formattedStartTime = startTime.replace(':', ':');
  const formattedEndTime = endTime.replace(':', ':');
  return `(${formattedStartTime} - ${formattedEndTime})`;
};

const filtroFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      opcions.value = props.groups;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcions.value = props.groups.filter(
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

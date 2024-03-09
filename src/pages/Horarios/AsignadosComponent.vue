<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { HorariosAsignados } from '../../components/models';
import { obtenerNombreMes } from '../../services/useWorkDays';

/* Defined Props */
const props = defineProps<{
  filas: HorariosAsignados[];
  groups: string[];
  grupos: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const $q = useQuasar();
const filter = ref('');
const modelo = ref('');
const departamento = ref('');
const opcions = ref(props.groups);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const { deletes } = useAxios();
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
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
  },
  {
    name: 'alm_nomcom',
    align: 'left',
    label: 'Lugar de trabajo asignado',
    field: 'alm_nomcom',
  },
  {
    name: 'horario',
    align: 'left',
    label: 'Horario',
    field: 'horario',
  },
  {
    name: 'mes',
    align: 'left',
    label: 'Mes',
    field: (row) => obtenerNombreMes(row.mes),
  },
  {
    name: 'anio',
    align: 'left',
    label: 'Año',
    field: 'anio',
  },
];
const visibleColumns = ref([
  'nombre_completo',
  'departamento',
  'alm_nomcom',
  'mes',
  'anio',
]);
const selected = ref([]);

// Methods
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${props.filas.length}`;
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

const enviarLyD = (lugar: string, departamento: string) => {
  emit('updateRows', { lugar, departamento });
};

const eliminar_horario_asignado = async (codigo: number) => {
  try {
    const response = await deletes(
      '/eliminar_horario_asignado',
      {},
      JSON.parse(
        JSON.stringify({
          usuario_codigo: codigo,
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
    console.error('Error eliminando el horario asignado:', error);
  }
};

const handleButtonClicked = async (selected: HorariosAsignados[]) => {
  for (const item of selected) {
    await eliminar_horario_asignado(item.codigo);
  }
  enviarLyD(modelo.value, departamento.value);
};

watch([modelo, departamento], ([newModelo, newDepartamento]) => {
  enviarLyD(newModelo, newDepartamento);
});
</script>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <div class="row">
        <p class="text-h6" style="font-family: 'Bebas Neue'">
          EMPLEADOS ASIGNADOS A HORARIOS
        </p>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="enviarLyD(modelo, departamento)"
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
        <div class="q-px-md">
          <q-select
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
        <div class="q-pr-md">
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
                <q-item-section> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-separator vertical />

        <div class="q-pl-md">
          <q-btn
            unelevated
            color="red"
            :label="
              selected.length == 1 ? 'Eliminar Horario' : 'Eliminar Horarios'
            "
            icon="delete"
            @click="handleButtonClicked(selected)"
            :disable="selected.length === 0"
          />
        </div>
      </div>
    </div>

    <q-table
      square
      flat
      bordered
      hide-bottom
      :rows="props.filas"
      :columns="columns"
      :filter="filter"
      row-key="codigo"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
    </q-table>
  </div>
</template>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

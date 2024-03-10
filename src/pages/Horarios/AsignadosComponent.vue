<script setup lang="ts">
import { ref, watch } from 'vue';
import NuevoHorario from './NuevoHorario.vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { Calendario, HorariosAsignados } from '../../components/models';
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
const codigo = ref(0);
const nombre = ref('');
const editar = ref(false);
const actualizar = ref(false);
const arrayHorario = ref<Calendario[]>([]);

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
    name: 'nombre_horario',
    align: 'left',
    label: 'Horario',
    field: 'nombre_horario',
  },
  {
    name: 'horario',
    align: 'left',
    label: 'Editar',
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
  'nombre_horario',
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

const eliminar_horario_asignado = async (code: number) => {
  try {
    const response = await deletes(
      '/eliminar_horario_asignado',
      {},
      JSON.parse(
        JSON.stringify({
          codigo: code,
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

// const editarHorario = (row) => {
//   console.log('Editar horario:', JSON.stringify(row));
// };

const editarHorario = async (
  code: number,
  name: string,
  horario: Calendario[]
) => {
  codigo.value = code;
  nombre.value = name;
  editar.value = true;
  arrayHorario.value = horario;
  console.log('[CODIGO EDITAR HORARIO]: ', JSON.stringify(codigo.value));
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
        <div class="q-py-sm">
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
        <div class="q-px-md q-py-sm">
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
        <div class="q-pr-md q-py-sm">
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
      class="my-sticky-header-last-column-table"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th>
            <q-checkbox v-model="props.selected" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>
            <span>Editar</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span style="font-weight: normal">{{ col.value }}</span>
          </q-td>
          <q-td auto-width>
            <q-btn
              icon="edit_note"
              color="white"
              round
              flat
              dense
              @click="
                editarHorario(
                  props.row.codigo,
                  props.row.nombre_horario,
                  props.row.horario
                )
              "
            >
              <q-tooltip
                class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                Editar
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editar" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div style="font-family: 'Bebas Neue'" class="text-h6">
            EDITAR HORARIO
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <NuevoHorario
          :code="codigo"
          :update="actualizar"
          :edit="editar"
          :name="nombre"
          :arregloHorario="arrayHorario"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
@import '../../css/sticky.header.last.column.table.scss';
</style>

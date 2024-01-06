<template>
  <div class="q-py-md">
    <q-btn
      color="primary"
      text-color="white"
      unelevated
      label="CREAR HORARIO"
      @click="handleCrearHorario"
    />
  </div>
  <div class="q-pa-md">
    <div class="column q-pb-none">
      <div class="row">
        <div>
          <p class="text-h6 q-pl-md" style="font-family: 'Bebas Neue'">
            Horarios
          </p>
        </div>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="updateSchedules()"
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
        <q-space />
        <div>
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
        <!-- <div class="q-pl-md">
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
          </div> -->
      </div>
      <!-- <div class="row justify-left">
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
        </div> -->
    </div>
  </div>
  <div class="q-pa-md">
    <q-table
      grid
      flat
      bordered
      :card-container-class="cardContainerClass"
      :rows="props.horarios"
      :columns="columnas"
      row-key="name"
      :filter="filter"
      hide-header
      hide-bottom
      :visible-columns="columnasVisibles"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <strong>{{ props.row.nombre }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section
              class="q-pa-xs flex flex-center"
              :style="{ fontSize: props.row.calories / 2 + 'px' }"
            >
              <div class="fit row wrap justify-evenly">
                <q-btn
                  flat
                  color="red"
                  icon="delete"
                  label="Eliminar"
                  @click="handleEliminar(props.row.codigo)"
                />
                <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  label="Editar"
                  @click="
                    handleEditar(
                      props.row.codigo,
                      props.row.nombre,
                      props.row.horario
                    )
                  "
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="primary" text-color="white" />
        <span class="q-ml-sm">¿Está seguro/a de eliminar el horario?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          flat
          label="Eliminar horario"
          color="primary"
          v-close-popup
          @click="eliminarHorario(row)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="crearHorario" full-width>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div style="font-family: 'Bebas Neue'" class="text-h6">
          CREAR HORARIO
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <NuevoHorario
        :code="codigo"
        :update="actualizar"
        :name="nombre"
        :arregloHorario="arrayHorario"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NuevoHorario from './NuevoHorario.vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { RespuestaHorario, Calendario } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  horarios: RespuestaHorario[];
}>();

/* Defined Emits */
const emit = defineEmits(['actualizarHorarios']);

//Data
const row = ref(0);
const $q = useQuasar();
const filter = ref('');
const codigo = ref(0);
const nombre = ref('');
const actualizar = ref(false);
const arrayHorario = ref<Calendario[]>([]);
const crearHorario = ref(false);
const dialogVisible = ref(false);
const { deletes } = useAxios();
const columnas: QTableProps['columns'] = [
  { name: 'id', label: 'Name', field: 'codigo' },
  { name: 'nombre', label: 'Horario', field: 'nombre' },
  { name: 'horario', label: 'Horario', field: 'horario' },
];
const columnasVisibles = ref(['id', 'nombre']);

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

//Methods
const handleCrearHorario = () => {
  codigo.value = 0;
  nombre.value = '';
  actualizar.value = false;
  arrayHorario.value = [];
  crearHorario.value = true;
};

const handleEliminar = async (valor: number) => {
  dialogVisible.value = true;
  row.value = valor;
  console.log('[ROW]: ', row.value);
};

const handleEditar = async (
  code: number,
  name: string,
  horario: Calendario[]
) => {
  codigo.value = code;
  nombre.value = name;
  actualizar.value = true;
  crearHorario.value = true;
  arrayHorario.value = horario;
  console.log('[HORARIO]: ', arrayHorario.value);
};

const eliminarHorario = async (codigo: number) => {
  const response = await deletes(
    '/eliminar_horario',
    {},
    {
      codigo: codigo,
    }
  );
  $q.notify({
    color: response.error === 'N' ? 'green-4' : 'red-5',
    textColor: 'white',
    icon: response.error === 'N' ? 'cloud_done' : 'warning',
    message: response.mensaje,
  });
};

const updateSchedules = () => {
  emit('actualizarHorarios');
};

//Computed
const cardContainerClass = computed(() => {
  return $q.screen.gt.xs
    ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
    : null;
});
</script>

<style scoped lang="sass">
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>

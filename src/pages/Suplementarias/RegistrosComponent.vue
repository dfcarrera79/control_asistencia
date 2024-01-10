<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useAxios } from '../../services/useAxios';
import { GroupObject } from '../../components/models';
import { FilasSuplementarias } from '../../components/models';
import { columnasSupleRegistros } from '../../components/columns';

// Data
const $q = useQuasar();
const confirm = ref(false);
const valor = ref(0);
const desde = ref('');
const hasta = ref('');
const filter = ref('');
const grupo = ref('');
const grupos = ref([]);
const { get, deletes } = useAxios();
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const filas = ref<FilasSuplementarias[]>([]);
const columnas = columnasSupleRegistros;

// Methods
const eliminarRegistro = async (codigo: number) => {
  try {
    const response = await deletes(
      '/eliminar_suplementarias',
      {},
      JSON.parse(
        JSON.stringify({
          codigo: codigo,
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
    console.error('Error eliminando el registro:', error);
  }
};

const handleDeleteButton = (val: number) => {
  confirm.value = true;
  valor.value = val;
};

const obtenerGrupos = async () => {
  const respuesta = await get('/obtener_grupos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  grupos.value = respuesta.objetos.map((obj: GroupObject) => obj.descripcion);
};

const obtenerRegistros = async (model: string, from: string, to: string) => {
  const respuesta = await get('/obtener_horas_suplementarias', {
    departamento: model,
    desde: from,
    hasta: to,
  });
  if (respuesta.error === 'S') {
    filas.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    filas.value = [];
  } else {
    filas.value = respuesta.objetos;
  }
};

const handleButtonClicked = async (model: string, from: string, to: string) => {
  filas.value = [];
  await obtenerRegistros(model, from, to);
};

onMounted(() => {
  obtenerGrupos();
  obtenerRegistros(grupo.value, '', '');
});

watch(grupo, () => {
  obtenerRegistros(grupo.value, '', '');
});
</script>

<template>
  <div>
    <div class="row">
      <div>
        <p class="text-h6 q-pl-md" style="font-family: 'Bebas Neue'">
          Registro de horas suplementarias
        </p>
      </div>
      <div class="q-pl-md">
        <q-btn
          flat
          rounded
          color="primary"
          icon="update"
          dense
          @click="handleButtonClicked(grupo, desde, hasta)"
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
      <div>
        <q-input
          outlined
          class="q-pl-md"
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
      <div>
        <q-select
          class="q-px-md"
          outlined
          dense
          v-model="grupo"
          :options="grupos"
          label="Departamentos"
          style="width: 200px"
        >
          <template v-if="grupo" v-slot:append>
            <q-icon
              name="cancel"
              @click.stop.prevent="grupo = ''"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>

      <q-separator vertical />

      <div class="q-pl-sm q-ma-sm" style="max-width: 200px">
        <q-input
          debounce="350"
          v-model="desde"
          mask="date"
          outlined
          dense
          options-dense
          label="Fecha desde:"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="desde" minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="q-mx-sm" style="max-width: 200px">
        <q-input
          debounce="350"
          v-model="hasta"
          mask="date"
          outlined
          dense
          options-dense
          label="Fecha hasta:"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="hasta" minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="q-pl-sm">
        <q-btn
          unelevated
          color="primary"
          label="Buscar registros"
          icon="search"
          :disable="!desde || !hasta"
          @click="handleButtonClicked(grupo, desde, hasta)"
        />
      </div>
    </div>

    <div class="q-pa-md">
      <q-table
        square
        flat
        bordered
        hide-bottom
        :rows="filas"
        :columns="columnas"
        :filter="filter"
        row-key="codigo"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        class="my-sticky-header-table text-h6"
        :visible-columns="[
          'nombre',
          'departamento',
          'fecha',
          'horas',
          'asignado',
        ]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="red"
                round
                dense
                icon="remove"
                @click="handleDeleteButton(props.row.codigo)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  class="bg-amber text-body2 text-black shadow-4"
                  :offset="[10, 10]"
                >
                  Eliminar horas suplementarias
                </q-tooltip>
              </q-btn>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar size="sm" icon="warning" color="primary" text-color="white" />
        <span class="q-ml-sm">¿Está seguro de eliminar este registro?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Eliminar"
          color="red"
          v-close-popup
          @click="
            eliminarRegistro(valor);
            handleButtonClicked(grupo, desde, hasta);
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

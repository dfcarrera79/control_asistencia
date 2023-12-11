<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <div class="row">
        <p class="text-h6" style="font-family: 'Bebas Neue'">
          Fotos registradas
        </p>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="enviarDepartamento(modelo)"
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
        <div>
          <q-select
            class="q-px-md"
            outlined
            dense
            v-model="modelo"
            :options="props.grupos"
            label="Departamentos"
            style="width: 200px"
          >
            <template v-if="modelo" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="modelo = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>

        <q-separator vertical />

        <div class="q-pl-md">
          <q-btn
            unelevated
            color="red"
            :label="
              selected.length == 1 ? 'Anular Registro' : 'Anular Registros'
            "
            icon="delete"
            :disable="selected.length === 0"
            @click="handleButtonClicked(selected)"
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
      row-key="id_foto"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="visibleColumns"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:body-cell-foto="props">
        <q-td :props="props">
          <q-img
            :src="props.row.path.replace(path as string, replacedPath as string)"
            alt="foto"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { FilasFotos } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  filas: FilasFotos[];
  grupos: string[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const $q = useQuasar();
const filter = ref('');
const modelo = ref('');
const authStore = useAuthStore();
const selected = ref([]);
const { deletes, post } = useAxios();
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const path = process.env.IMAGE_PATH;
const replacedPath = process.env.REPLACED_PATH;
const columns: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'ID', field: 'id_foto' },
  { name: 'id', align: 'left', label: 'Cedula', field: 'cedula_ruc' },
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
    name: 'foto',
    align: 'left',
    label: 'Foto',
    field: 'path',
  },
];
const visibleColumns = ref(['id', 'nombre_completo', 'departamento', 'foto']);

// Methods
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${props.filas.length}`;
};

const enviarDepartamento = (event: string) => {
  emit('updateRows', event);
};

const eliminarFoto = async (id: number) => {
  try {
    const response = await deletes(
      '/eliminar_foto',
      {},
      JSON.parse(
        JSON.stringify({
          id_foto: id,
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
    return response;
  } catch (error) {
    console.error('Error eliminando el registro:', error);
  }
};

const anularFoto = async (usuario: number, path: string, anulado: number) => {
  try {
    const response = await post(
      '/copiar_path_id',
      {},
      JSON.parse(
        JSON.stringify({
          usuario_codigo: usuario,
          pathorid: path,
          anulado_por: anulado,
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
    console.error('Error anulando el registro:', error);
  }
};

interface foto {
  path: string;
  usuario_codigo: number;
}

interface RespuestaEliminarFoto {
  error: string;
  mensaje: string;
  objetos: foto[];
}

const handleButtonClicked = async (selected: FilasFotos[]) => {
  for (const item of selected) {
    const respuesta: RespuestaEliminarFoto = await eliminarFoto(item.id_foto);
    if (respuesta.error === 'N') {
      const objetos = respuesta.objetos[0];
      await anularFoto(
        objetos.usuario_codigo,
        objetos.path,
        authStore.getCodigo
      );
    }
    enviarDepartamento(modelo.value);
  }
};

watch(modelo, (newValue) => {
  enviarDepartamento(newValue);
});
</script>

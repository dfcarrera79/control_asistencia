<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { FilasDispositivos } from '../../components/models';
import { columnasCelulares } from '../../components/columns';

/* Defined Props */
const props = defineProps<{
  filas: FilasDispositivos[];
  grupos: string[];
}>();

/* defined emits*/
const emit = defineEmits(['actualizarFilas']);

// Data
const $q = useQuasar();
const filter = ref('');
const modelo = ref('');
const authStore = useAuthStore();
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const selected = ref([]);
const { deletes, post } = useAxios();
const columns = columnasCelulares;

// Methods
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${
        selected.value.length > 1 ? 's' : ''
      } selected of ${props.filas.length}`;
};

const enviarDepartamento = (event: string) => {
  emit('actualizarFilas', event);
};

const eliminarCelular = async (id: number) => {
  try {
    const response = await deletes(
      '/eliminar_cel',
      {},
      JSON.parse(
        JSON.stringify({
          codigo: id,
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

const anularRegistro = async (
  usuario: number,
  path: string,
  anulado: number
) => {
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

interface cel {
  id_dispositivo: string;
  usuario_codigo: number;
}

interface RespuestaEliminarCel {
  error: string;
  mensaje: string;
  objetos: cel[];
}

const handleButtonClicked = async (selected: FilasDispositivos[]) => {
  for (const item of selected) {
    const respuesta: RespuestaEliminarCel = await eliminarCelular(item.codigo);
    if (respuesta.error === 'N') {
      const objetos = respuesta.objetos[0];
      await anularRegistro(
        objetos.usuario_codigo,
        objetos.id_dispositivo,
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

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <div class="row">
        <p class="text-h6" style="font-family: 'Bebas Neue'">IDs Celulares</p>
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
      row-key="codigo"
      class="my-sticky-header-table text-h6"
      :rows-per-page-options="[0]"
      v-model:pagination="pagination"
      :visible-columns="[
        'id',
        'nombre_completo',
        'departamento',
        'id_dispositivo',
      ]"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
    </q-table>
  </div>
</template>

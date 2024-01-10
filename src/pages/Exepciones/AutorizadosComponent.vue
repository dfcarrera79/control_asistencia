<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAxios } from 'src/services/useAxios';
import { Autorizados } from '../../components/models';
import { columnasAutorizados } from '../../components/columns';

/* Defined Props */
const props = defineProps<{
  zeilen: Autorizados[];
}>();

/* defined emits*/
const emit = defineEmits(['updateRows']);

// Data
const $q = useQuasar();
const filter = ref('');
const selected = ref([]);
const desde = ref('');
const hasta = ref('');
const { put } = useAxios();
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

const columns = columnasAutorizados;
const visibleColumns = ref([
  'nombre_completo',
  'excepcion',
  'dias',
  'autorizado_por',
]);

// Methods
const actualizarFilas = (eventDesde: string, eventHasta: string) => {
  emit('updateRows', {
    eventDesde,
    eventHasta,
  });
};

const desautorizarExcepcion = async (id: number) => {
  try {
    const response = await put(
      '/desautorizar_exepcion',
      {},
      JSON.parse(
        JSON.stringify({
          id: id,
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
    console.error('Error eliminando la autorización:', error);
  }
};

const handleDeleteButton = (selected: Autorizados[]) => {
  for (const item of selected) {
    desautorizarExcepcion(item.id);
  }
  actualizarFilas(desde.value, hasta.value);
};

watch([desde, hasta], () => {
  // Ejecuta la función actualizarFilas()
  actualizarFilas(desde.value, hasta.value);
});
</script>

<template>
  <div class="q-pa-md">
    <div class="column q-pb-md">
      <div class="row">
        <p class="text-h6" style="font-family: 'Bebas Neue'">Historial</p>
        <div class="q-pl-md">
          <q-btn
            flat
            rounded
            color="primary"
            icon="update"
            dense
            @click="actualizarFilas(desde, hasta)"
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

        <div class="q-pt-xs q-pr-md" style="max-width: 200px">
          <q-input
            debounce="350"
            v-model="desde"
            mask="date"
            label="Fecha desde: "
            outlined
            dense
            options-dense
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
                      <q-btn
                        v-close-popup
                        label="Borrar"
                        color="primary"
                        flat
                        @click="desde = ''"
                      />
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="q-pt-xs q-pr-md" style="max-width: 200px">
          <q-input
            debounce="350"
            label="Fecha hasta: "
            v-model="hasta"
            mask="date"
            outlined
            dense
            options-dense
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
                      <q-btn
                        v-close-popup
                        label="Borrar"
                        color="primary"
                        flat
                        @click="hasta = ''"
                      />
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-separator vertical />

        <div class="q-pt-xs q-pl-md">
          <q-btn
            unelevated
            color="red"
            label="Eliminar autorización"
            icon="do_not_disturb_on"
            @click="handleDeleteButton(selected)"
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
      :rows="props.zeilen"
      :columns="columns"
      :filter="filter"
      row-key="id"
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

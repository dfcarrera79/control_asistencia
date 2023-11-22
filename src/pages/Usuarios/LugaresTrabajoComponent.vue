<template>
  <div>
    <div class="q-pa-md">
      <div class="column q-pb-none">
        <div class="row">
          <div>
            <p
              class="text-h6 text-grey-8 q-pl-md"
              style="font-family: 'Bebas Neue'"
            >
              LUGARES DE TRABAJO
            </p>
          </div>
          <div class="q-pl-md">
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
          </div>
        </div>
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
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        square
        flat
        bordered
        hide-bottom
        :rows="props.rows"
        :columns="columns"
        :filter="filter"
        row-key="alm_codigo"
        class="my-sticky-header-table text-h6 text-grey-8"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="visibleColumns"
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
                color="primary"
                round
                dense
                @click="
                  props.expand = !props.expand;
                  obtenerCoordenadas(props.row.alm_codigo);
                "
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <q-icon
                name="done"
                size="1.5em"
                color="green"
                v-if="showDoneIcon(props.row.alm_codigo, col.name)"
              />
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <q-toggle v-model="checked" label="Editar coordenadas" />
                <div class="column justify-start" v-if="checked">
                  <q-btn
                    dense
                    outline
                    color="primary"
                    @click="
                      openGoogleMaps(
                        `${props.row.alm_calles}, ${props.row.alm_ciud}, ${props.row.alm_pais}`
                      )
                    "
                    style="margin-left: 9px; width: 343px"
                  >
                    Buscar dirección en Google Maps
                  </q-btn>

                  <div class="row justify-start">
                    <q-input
                      dense
                      color="primary"
                      outlined
                      v-model="text"
                      label="Ingresar coordenadas"
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Por favor ingrese las coordenadas',
                      ]"
                      class="q-pa-sm"
                      style="width: 360px"
                    >
                      <template v-slot:append>
                        <q-icon
                          name="close"
                          @click="text = ''"
                          class="cursor-pointer"
                        />
                      </template>
                    </q-input>

                    <q-btn
                      v-if="!toogle"
                      dense
                      label="Guardar"
                      color="primary"
                      icon="save"
                      :ripple="{ center: true }"
                      :disable="text.length === 0"
                      style="
                        max-width: 150px;
                        max-height: 39px;
                        margin-top: 9px;
                      "
                      @click="registrarCoordenadas(props.row.alm_codigo, text)"
                    />

                    <q-btn
                      v-if="toogle"
                      dense
                      label="Actualizar"
                      color="primary"
                      icon="update"
                      :ripple="{ center: true }"
                      :disable="text.length === 0"
                      style="
                        max-width: 150px;
                        max-height: 39px;
                        margin-top: 9px;
                      "
                      @click="actualizarCoordenadas(props.row.alm_codigo, text)"
                    />
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { FilasAlmacenes } from '../../components/models';

/* Defined Props */
const props = defineProps<{
  rows: FilasAlmacenes[];
  lugaresAsignados: number[];
}>();

/* defined emits*/
const emit = defineEmits(['actualizarLugares']);

// Data
const text = ref('');
const $q = useQuasar();
const filter = ref('');
const toogle = ref(false);
const checked = ref(false);
const { get, post, put } = useAxios();

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const visibleColumns = ref(['nomcom', 'calles', 'ciudad', 'telefono']);

const columns: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'Id', field: 'alm_codigo' },
  {
    name: 'nomcom',
    align: 'left',
    label: 'Nombre del lugar',
    field: 'alm_nomcom',
    sortable: true,
  },
  { name: 'calles', align: 'left', label: 'Dirección', field: 'alm_calles' },
  { name: 'pais', align: 'left', label: 'País', field: 'alm_pais' },
  {
    name: 'ciudad',
    align: 'left',
    label: 'Ciudad',
    field: 'alm_ciud',
    sortable: true,
  },
  { name: 'telefono', align: 'left', label: 'Teléfono 1', field: 'alm_tlf1' },
  { name: 'telefon', align: 'left', label: 'Teléfono 2', field: 'alm_tlf2' },
];

// Methods
const showDoneIcon = (codigo: number, nombre: string) => {
  return props.lugaresAsignados.includes(codigo) && nombre === 'nomcom';
};

const updateRows = () => {
  emit('actualizarLugares');
};

const openGoogleMaps = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  window.open(mapsUrl, '_blank');
};

const obtenerCoordenadas = async (id: number) => {
  const respuesta = await get('/obtener_coordenadas', { alm_codigo: id });
  if (respuesta.error === 'S') {
    checked.value = true;
    toogle.value = false;
  }

  // Check if the response contains data
  if (respuesta.objetos.length !== 0) {
    checked.value = false;
    toogle.value = true;
  }
};

const registrarCoordenadas = async (
  targetId: number,
  targetCoordinates: string
) => {
  const [targetLatitude, targetLongitude] = targetCoordinates
    .split(',')
    .map((coord) => parseFloat(coord.trim()));
  try {
    const response = await post(
      '/registrar_coordenadas',
      {},
      JSON.parse(
        JSON.stringify({
          alm_codigo: targetId,
          lat: targetLatitude,
          long: targetLongitude,
        })
      )
    );

    if (response.error === 'N') {
      // check.value = true;
      text.value = ' ';
    }
    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando las coordenadas:', error);
  }
};

const actualizarCoordenadas = async (
  targetId: number,
  targetCoordinates: string
) => {
  const [targetLatitude, targetLongitude] = targetCoordinates
    .split(',')
    .map((coord) => parseFloat(coord.trim()));
  try {
    const response = await put(
      '/actualizar_coordenadas',
      {},
      JSON.parse(
        JSON.stringify({
          alm_codigo: targetId,
          lat: targetLatitude,
          long: targetLongitude,
        })
      )
    );

    if (response.error === 'N') {
      // check.value = true;
      text.value = ' ';
    }
    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando las coordenadas:', error);
  }
};
</script>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

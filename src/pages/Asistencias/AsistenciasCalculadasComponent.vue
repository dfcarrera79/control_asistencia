<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import {
  AsistenciasAtrasos,
  Lugar,
  RegistrosDeHoras,
} from '../../components/models';
import { columnasAsistenciasCalculadas } from '../../components/columns';

// Data
const $q = useQuasar();
const { get, post } = useAxios();
const authStore = useAuthStore();
const selected = ref([]);
const filter = ref('');
const desde = ref('');
const hasta = ref('');
const anio = ref(0);
const mes = ref(0);
const lugar = ref('');
const lugares = ref<string[]>([]);
const opcionesLugares = ref(lugares.value);

const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};

const filas = ref<AsistenciasAtrasos[]>([]);
const columnas = columnasAsistenciasCalculadas;

// Methods
const registrarCierreMes = async (
  user_create: number,
  data: RegistrosDeHoras[]
) => {
  mes.value = new Date(desde.value).getMonth() + 1;
  anio.value = new Date(desde.value).getFullYear();

  try {
    const response = await post(
      '/registrar_consolidacion',
      {},
      JSON.parse(
        JSON.stringify({
          mes: mes.value,
          anio: anio.value,
          usuarioCreo: user_create,
          datos: data,
        })
      )
    );

    if (response.error === 'N') {
      selected.value = [];
      desde.value = '';
      hasta.value = '';
      filas.value = [];
    }

    // Handle the response accordingly
    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando el cierre de mes:', error);
  }
};

const isValidDateRange = computed(() => {
  if (!desde.value || !hasta.value) {
    return true; // Si alguna fecha está en blanco, deshabilita el botón
  }

  const fromDate = new Date(desde.value);
  const toDate = new Date(hasta.value);

  // Calcula la diferencia en meses
  const diffInMonths =
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth());

  return diffInMonths <= 0; // Habilita el botón si la diferencia es menor o igual a 0
});

const filtroLugaresFn = (
  val: string,
  update: (callback: () => void) => void
) => {
  if (val === '') {
    update(() => {
      opcionesLugares.value = lugares.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesLugares.value = lugares.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const obtenerLugaresTrabajo = async () => {
  const respuesta = await get('/obtener_lugar_empleado', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  const data: Lugar[] = respuesta.objetos;
  lugares.value = [...new Set(data.map((item) => item.lugares))];
};

const obtenerCalculos = async (modelo: string) => {
  const respuesta = await get('/calcular_horas_atrasos', {
    lugar: modelo,
    fecha_desde: desde.value,
    fecha_hasta: hasta.value,
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

onMounted(() => {
  obtenerLugaresTrabajo();
});
</script>

<template>
  <div>
    <div class="column">
      <div>
        <p class="text-h6 q-pl-md" style="font-family: 'Bebas Neue'">
          Asistencias y atrasos
        </p>
      </div>

      <div class="col-12 gt-xs q-pl-md">
        <p>
          <strong>Nota:</strong>
        </p>
        <ol>
          <li>
            Seleccione un rango de fechas (desde - hasta) y de click en
            "Consultar".
          </li>
          <li>
            Deben registrarse las asistencias consultadas mediante el botón
            "Consolidar mes". Asegúrese de seleccionar un rango de fechas
            correspondiente a un único mes para la consolidación.
          </li>
        </ol>
      </div>

      <div class="row justify-left items-center q-py-sm q-pr-md">
        <div class="q-pr-sm">
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
        <div class="q-ma-sm" style="width: 250px">
          <q-select
            dense
            filled
            v-model="lugar"
            use-input
            hide-selected
            fill-input
            input-debounce="300"
            label="Lugares asignados"
            :options="opcionesLugares"
            @filter="filtroLugaresFn"
            style="width: 250px"
          >
            <template v-if="lugar" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="lugar = ''"
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
        <div class="q-ma-sm" style="max-width: 200px">
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

        <div class="q-ma-sm" style="max-width: 200px">
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

        <div class="q-pl-sm q-py-sm">
          <q-btn
            unelevated
            color="primary"
            icon="search"
            label="Consultar"
            @click="obtenerCalculos(lugar)"
            :disable="desde == '' || hasta == ''"
          />
        </div>

        <div class="q-pl-md q-py-sm">
          <q-btn
            unelevated
            color="primary"
            icon="publish"
            label="Consolidar mes"
            :disable="!isValidDateRange || selected.length === 0"
            @click="registrarCierreMes(authStore.getCodigo, selected)"
          />
        </div>
      </div>
    </div>

    <div>
      <q-table
        flat
        bordered
        class="my-sticky-header-table text-h6"
        :rows="filas"
        :columns="columnas"
        selection="multiple"
        v-model:selected="selected"
        row-key="codigo"
        hide-bottom
        hide-pagination
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="[
          'nombre',
          'lugar',
          'horas',
          'suplementarias',
          'atrasos',
        ]"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

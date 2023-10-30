<template>
  <div>
    <div class="column q-pb-md">
      <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
        Registro de consolidaciones
      </p>
    </div>
    <div class="row justify-left">
      <div class="q-pt-sm q-pr-md">
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

      <q-separator vertical />
      <div class="row justify-left items-top q-pl-md q-py-sm row">
        <div style="width: 150px">
          <q-select
            dense
            outlined
            v-model="selectedMonth"
            :options="monthOptions"
            emit-value
            label="Mes"
            option-label="nombre"
            hint="Seleccionar mes"
          />
        </div>
        <div class="q-pl-md" style="width: 150px">
          <q-select
            dense
            outlined
            v-model="selectedYear"
            :options="yearOptions"
            label="Año"
            hint="Seleccionar año"
          />
        </div>
        <div class="q-pl-md">
          <q-btn
            color="primary"
            label="Buscar registro"
            icon="search"
            @click="obtenerConsolidaciones(selectedMonth.codigo, selectedYear)"
            :disable="!selectedMonth || !selectedYear"
          />
        </div>
        <div class="q-pl-md">
          <q-btn
            color="red"
            label="Anular consolidación"
            icon="cancel"
            :disable="filas.length === 0"
            @click="anularConsolidacion(authStore.getCodigo, codigo)"
          />
        </div>
      </div>
    </div>
    <div>
      <q-table
        flat
        bordered
        class="text-h6 text-grey-8"
        :rows="filas"
        :columns="columnas"
        :title="tituloTabla"
        row-key="codigo_detalle"
        hide-bottom
        hide-pagination
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="columnasVisibles"
      >
        <template v-slot:top-right="props">
          <div class="q-pr-md">
            <q-select
              v-model="columnasVisibles"
              multiple
              outlined
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              label="Columnas visibles"
              emit-value
              map-options
              :options="columnas"
              option-value="name"
              options-cover
              style="min-width: 150px"
            />
          </div>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Exportar a csv"
            no-caps
            @click="exportTable"
            :disable="filas.length === 0"
          />
          <q-btn
            v-if="filas.length > 0"
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useAxios } from 'src/services/useAxios';
import { RegistrosConsolidados } from '../../components/models';
import { exportFile, QTableProps, useQuasar } from 'quasar';
import {
  obtenerHorasYMinutos,
  obtenerMinutosYSegundos,
} from '../../services/useWorkDays';

// Data
const codigo = ref(0);
const $q = useQuasar();
const filter = ref('');
const selectedYear = ref(null);
const { get, put } = useAxios();
const authStore = useAuthStore();
const yearOptions = ref<number[]>([]);
const selectedMonth = ref<Meses | null>(null);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const filas = ref<RegistrosConsolidados[]>([]);
const columnas: QTableProps['columns'] = [
  {
    name: 'codigo',
    align: 'left',
    label: 'ID',
    field: 'codigo_detalle',
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: 'nombre_completo',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'left',
    label: 'Departamento',
    field: 'departamento',
    sortable: true,
  },
  {
    name: 'horas',
    align: 'left',
    label: 'Hora trabajadas',
    field: (row) => obtenerHorasYMinutos(row.normal),
  },
  {
    name: 'suplementarias',
    align: 'left',
    label: 'Horas suplementarias',
    field: (row) =>
      row.suplementarias !== null ? `${row.suplementaria} H` : '0 H',
  },
  {
    name: 'atrasos',
    align: 'left',
    label: 'Atrasos',
    field: (row) => obtenerMinutosYSegundos(row.atrasos),
  },
];

const columnasVisibles = ref([
  'nombre',
  'departamento',
  'horas',
  'suplementarias',
  'atrasos',
]);

interface Meses {
  nombre: string;
  codigo: number;
}

const monthOptions = ref<Meses[]>([
  { nombre: 'Enero', codigo: 1 },
  { nombre: 'Febrero', codigo: 2 },
  { nombre: 'Marzo', codigo: 3 },
  { nombre: 'Abril', codigo: 4 },
  { nombre: 'Mayo', codigo: 5 },
  { nombre: 'Junio', codigo: 6 },
  { nombre: 'Julio', codigo: 7 },
  { nombre: 'Agosto', codigo: 8 },
  { nombre: 'Septiembre', codigo: 9 },
  { nombre: 'Octubre', codigo: 10 },
  { nombre: 'Noviembre', codigo: 11 },
  { nombre: 'Diciembre', codigo: 12 },
]);

// Methods
// Función para obtener el año actual
const tituloTabla = computed(() => {
  if (!selectedMonth.value || !selectedYear.value) {
    return 'Consolidación';
  }
  return `Consolidación Mes de ${selectedMonth.value?.nombre} ${selectedYear.value}`;
});

const getCurrentYear = (): number => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

const obtenerConsolidaciones = async (
  month: number | null,
  year: number | null
) => {
  const respuesta = await get('/listar_consolidaciones', {
    mes: month,
    anio: year,
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
    codigo.value = respuesta.mensaje;
  }
};

const anularConsolidacion = async (userCode: number, code: number) => {
  try {
    const response = await put(
      '/anular_consolidacion',
      {},
      JSON.parse(
        JSON.stringify({
          codigoCierre: code,
          usuarioActualizo: userCode,
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

    if (response.error === 'N') {
      filas.value = [];
    }
  } catch (error) {
    console.error('Error anulando el registro consolidado:', error);
  }
};

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
};

const exportTable = () => {
  // Obtener las columnas visibles
  const visibleColumns = columnas.filter((col) =>
    columnasVisibles.value.includes(col.name)
  );

  // Crear la primera fila del archivo CSV con las etiquetas de las columnas visibles
  const headerRow = visibleColumns.map((col) => wrapCsvValue(col.label));

  // Crear las filas de datos
  const dataRows = filas.value.map((row) =>
    visibleColumns
      .map((col) =>
        wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )
      )
      .join(',')
  );

  // Combinar las filas en el contenido del archivo CSV
  const content = [headerRow].concat(dataRows).join('\r\n');

  const status = exportFile('table-export.csv', content, 'text/csv');

  if (status !== true) {
    $q.notify({
      message: 'El navegador denegó la descarga de archivos...',
      color: 'negative',
      icon: 'warning',
    });
  }
};

onMounted(() => {
  const currentYear = getCurrentYear();
  const maxYear = currentYear + 3;
  for (let year = currentYear - 3; year <= maxYear; year++) {
    yearOptions.value.push(year);
  }
});
</script>

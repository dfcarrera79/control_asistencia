<template>
  <div>
    <div class="column">
      <div>
        <p
          class="text-h6 text-grey-8 q-pl-md"
          style="font-family: 'Bebas Neue'"
        >
          Horas suplementarias
        </p>
      </div>
    </div>

    <div class="row justify-left">
      <div class="row q-py-sm">
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
      </div>

      <q-separator vertical />

      <div class="q-pl-md q-py-sm row">
        <div class="q-px-sm">
          <q-input dense v-model="date" filled type="date" hint="Fecha" />
        </div>

        <div class="q-px-sm">
          <q-input
            dense
            v-model.number="horasSuplementarias"
            type="number"
            filled
            hint="Horas suplementarias"
            style="max-width: 140px"
          />
        </div>

        <div class="q-pl-md">
          <q-btn
            color="primary"
            label="Asignar horas suplementarias"
            icon="business"
            :disable="!date || !horasSuplementarias"
            @click="
              handleButtonClicked(
                selected,
                date,
                horasSuplementarias,
                authStore.getCodigo
              )
            "
          />
        </div>
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
        selection="multiple"
        v-model:selected="selected"
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        :visible-columns="['nombre', 'departamento']"
        class="my-sticky-header-table text-h6 text-grey-8"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { GroupObject } from '../../components/models';
import { FilasEmpleados } from '../../components/models';

// Data
const date = ref('');
const grupo = ref('');
const grupos = ref([]);
const $q = useQuasar();
const filter = ref('');
const selected = ref([]);
const authStore = useAuthStore();
const { get, post } = useAxios();
const horasSuplementarias = ref(0);
const filas = ref<FilasEmpleados[]>([]);
const pagination = {
  page: 1,
  rowsPerPage: 0, // 0 means all rows
};
const columnas: QTableProps['columns'] = [
  { name: 'codigo', align: 'left', label: 'Codigo', field: 'codigo' },
  {
    name: 'nombre',
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
    sortable: true,
  },
];

// Methods
const obtenerGrupos = async () => {
  const respuesta = await get('/obtener_grupos', {});
  if (respuesta.error === 'S') {
    console.error(respuesta.mensaje);
    return;
  }
  grupos.value = respuesta.objetos.map((obj: GroupObject) => obj.descripcion);
};

const obtenerEmpleados = async (model: string) => {
  const respuesta = await get('/obtener_empleado_suplementarias', {
    departamento: model,
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

interface Empleados {
  codigo: number;
  nombre: string;
  departamento: string;
}

const registrarHoras = async (
  usuario_codigo: number,
  fecha: string,
  horas: number,
  asignadoPor: number
) => {
  try {
    const response = await post(
      '/registrar_horas_suplementarias',
      {},
      JSON.parse(
        JSON.stringify({
          usuario_codigo: usuario_codigo,
          fecha: fecha,
          horas: horas,
          asignadoPor: asignadoPor,
        })
      )
    );

    $q.notify({
      color: response.error === 'N' ? 'green-4' : 'red-5',
      textColor: 'white',
      icon: response.error === 'N' ? 'cloud_done' : 'warning',
      message: response.mensaje,
    });
  } catch (error) {
    console.error('Error registrando la exepción:', error);
  }
};

const handleButtonClicked = async (
  selected: Empleados[],
  fecha: string,
  horas: number,
  asignadoPor: number
) => {
  for (const item of selected) {
    await registrarHoras(item.codigo, fecha, horas, asignadoPor);
  }
};

onMounted(() => {
  obtenerGrupos();
  obtenerEmpleados(grupo.value);
});

watch(grupo, () => {
  obtenerEmpleados(grupo.value);
});
</script>

<style lang="scss">
@import '../../css/sticky.header.table.scss';
</style>

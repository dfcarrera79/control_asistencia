<template>
  <div class="column">
    <div class="q-pl-md">
      <p class="text-h6 text-grey-8 q-pl-md" style="font-family: 'Bebas Neue'">
        CREAR HORARIOS
      </p>
    </div>

    <div class="row q-pl-lg">
      <div class="q-py-md">
        <q-btn
          color="primary"
          text-color="white"
          unelevated
          icon="schedule"
          label="Una jornada"
          @click="dialogoUno = true"
        />
      </div>

      <div class="q-py-md q-pl-md">
        <q-btn
          color="primary"
          text-color="white"
          unelevated
          icon="schedule"
          label="Dos jornadas"
          @click="dialogoDos = true"
        />
      </div>
    </div>
  </div>

  <div class="q-pa-md">
    <div class="q-pa-md">
      <div class="column q-pb-md">
        <div class="row">
          <div>
            <p class="text-h6 text-grey-8" style="font-family: 'Bebas Neue'">
              HORARIOS REGISTRADOS
            </p>
          </div>
          <!-- <div class="q-pl-md">
            <q-btn
              flat
              rounded
              color="primary"
              icon="update"
              dense
              @click="obtenerHorarios()"
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
      </div>
    </div>
    <div class="q-pa-md">
      <q-scroll-area style="height: 550px">
        <q-table
          flat
          bordered
          grid
          :rows="rows"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="name"
          hide-header
          hide-bottom
        >
          <template v-slot:item="props">
            <div class="q-pa-xs" style="width: 350px">
              <q-card flat bordered>
                <q-card-section class="text-left text-grey-9">
                  <strong>{{ props.row.nombre.toUpperCase() }}</strong>
                </q-card-section>
                <q-separator />
                <q-list dense>
                  <q-item
                    v-for="col in props.cols.filter(
                      (col) => col.name !== 'desc'
                    )"
                    :key="col.name"
                  >
                    <q-item-section>
                      <q-item-label class="text-grey-9"
                        >{{ col.label }}:
                      </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-separator />
                <q-card-actions>
                  <q-btn
                    flat
                    color="primary"
                    icon="delete"
                    label="Eliminar"
                    @click="eliminarHorario(props.row.codigo)"
                  />
                  <q-btn
                    flat
                    color="primary"
                    icon="update"
                    label="Actualizar"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-scroll-area>
    </div>
  </div>

  <div>
    <q-dialog v-model="dialogoUno">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-grey-9" style="font-family: 'Bebas Neue'">
            UNA SOLA JORNADA
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <div style="max-width: 460px">
              <q-input
                outlined
                bottom-slots
                v-model="nombre"
                label="Nombre del horario"
                dense
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="nombre = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="q-gutter-sm row">
              <div>
                <div>
                  <p
                    class="text-subtitle2 text-grey-9"
                    style="font-family: 'Oswald'"
                  >
                    Hora de entrada:
                  </p>
                </div>
                <q-input
                  dense
                  filled
                  v-model="entrada_uno"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="entrada_uno">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="q-pl-md">
                <div>
                  <p
                    class="text-subtitle2 text-grey-9"
                    style="font-family: 'Oswald'"
                  >
                    Hora de salida:
                  </p>
                </div>
                <q-input
                  dense
                  filled
                  v-model="salida_uno"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="salida_uno">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div>
                <div>
                  <p
                    class="text-subtitle2 text-grey-9"
                    style="font-family: 'Oswald'"
                  >
                    Días:
                  </p>
                </div>

                <div class="q-gutter-sm">
                  <q-checkbox
                    dense
                    v-model="lunes"
                    label="Lunes"
                    color="primary"
                  />
                  <q-checkbox
                    dense
                    v-model="martes"
                    label="Martes"
                    color="primary"
                  />
                  <q-checkbox
                    dense
                    v-model="miercoles"
                    label="Miércoles"
                    color="primary"
                  />
                  <q-checkbox
                    dense
                    v-model="jueves"
                    label="Jueves"
                    color="primary"
                  />
                  <q-checkbox
                    dense
                    v-model="viernes"
                    label="Viernes"
                    color="primary"
                  />
                </div>
                <div class="q-gutter-sm q-pt-sm">
                  <q-checkbox
                    dense
                    v-model="sabado"
                    label="Sábado"
                    color="primary"
                  />
                  <q-checkbox
                    dense
                    v-model="domingo"
                    label="Domingo"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Crear Horario"
            @click="
              generarDias();
              registrarHorario(
                nombre,
                jsonString,
                entrada_uno,
                salida_uno,
                '00:00',
                '00:00'
              );
              obtenerHorarios();
            "
            :disable="
              nombre === '' ||
              (!lunes &&
                !martes &&
                !miercoles &&
                !jueves &&
                !viernes &&
                !sabado &&
                !domingo)
            "
          />
          <q-btn flat label="Cerrar" v-close-popup @click="cerrarDialogo()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogoDos">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-grey-9" style="font-family: 'Bebas Neue'">
            DOBLE JORNADA
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <div style="max-width: 460px">
              <q-input
                outlined
                bottom-slots
                v-model="nombre"
                label="Nombre del horario"
                dense
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="nombre = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="column">
              <div>
                <p
                  class="text-subtitle1 text-grey-9"
                  style="font-family: 'Oswald'"
                >
                  JORNADA 1
                </p>
                <div class="q-gutter-sm row">
                  <div>
                    <div>
                      <p
                        class="text-subtitle2 text-grey-9"
                        style="font-family: 'Oswald'"
                      >
                        Hora de entrada:
                      </p>
                    </div>
                    <q-input
                      dense
                      filled
                      v-model="entrada_uno"
                      mask="time"
                      :rules="['time']"
                    >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="entrada_uno">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="q-pl-md">
                    <div>
                      <p
                        class="text-subtitle2 text-grey-9"
                        style="font-family: 'Oswald'"
                      >
                        Hora de salida:
                      </p>
                    </div>
                    <q-input
                      dense
                      filled
                      v-model="salida_uno"
                      mask="time"
                      :rules="['time']"
                    >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="salida_uno">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div>
                <p
                  class="text-subtitle1 text-grey-9"
                  style="font-family: 'Oswald'"
                >
                  JORNADA 2
                </p>
              </div>

              <div class="q-gutter-sm row">
                <div>
                  <div>
                    <p
                      class="text-subtitle2 text-grey-9"
                      style="font-family: 'Oswald'"
                    >
                      Hora de entrada:
                    </p>
                  </div>
                  <q-input
                    dense
                    filled
                    v-model="entrada_dos"
                    mask="time"
                    :rules="['time']"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="entrada_dos">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="q-pl-md">
                  <div>
                    <p
                      class="text-subtitle2 text-grey-9"
                      style="font-family: 'Oswald'"
                    >
                      Hora de salida:
                    </p>
                  </div>
                  <q-input
                    dense
                    filled
                    v-model="salida_dos"
                    mask="time"
                    :rules="['time']"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time v-model="salida_dos">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <div>
                <p
                  class="text-subtitle2 text-grey-9"
                  style="font-family: 'Oswald'"
                >
                  Días:
                </p>
              </div>

              <div class="q-gutter-sm">
                <q-checkbox
                  dense
                  v-model="lunes"
                  label="Lunes"
                  color="primary"
                />
                <q-checkbox
                  dense
                  v-model="martes"
                  label="Martes"
                  color="primary"
                />
                <q-checkbox
                  dense
                  v-model="miercoles"
                  label="Miércoles"
                  color="primary"
                />
                <q-checkbox
                  dense
                  v-model="jueves"
                  label="Jueves"
                  color="primary"
                />
                <q-checkbox
                  dense
                  v-model="viernes"
                  label="Viernes"
                  color="primary"
                />
              </div>
              <div class="q-gutter-sm q-pt-sm">
                <q-checkbox
                  dense
                  v-model="sabado"
                  label="Sábado"
                  color="primary"
                />
                <q-checkbox
                  dense
                  v-model="domingo"
                  label="Domingo"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Crear Horario"
            @click="
              generarDias();
              registrarHorario(
                nombre,
                jsonString,
                entrada_uno,
                salida_uno,
                entrada_dos,
                salida_dos
              );
            "
            :disable="
              nombre === '' ||
              (!lunes &&
                !martes &&
                !miercoles &&
                !jueves &&
                !viernes &&
                !sabado &&
                !domingo)
            "
          />
          <q-btn flat label="Cerrar" v-close-popup @click="cerrarDialogo()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import { FilasHorarios } from '../../components/models';

// Data
const $q = useQuasar();
const nombre = ref('');
const dialogoUno = ref(false);
const dialogoDos = ref(false);
const { get, post, put, deletes } = useAxios();

const lunes = ref(false);
const martes = ref(false);
const miercoles = ref(false);
const jueves = ref(false);
const viernes = ref(false);
const sabado = ref(false);
const domingo = ref(false);

const entrada_uno = ref('00:00');
const salida_uno = ref('00:00');
const entrada_dos = ref('00:00');
const salida_dos = ref('00:00');

const jsonString = ref('');

// const filter = ref('');

const rows = ref<FilasHorarios[]>([]);
const columns: QTableProps['columns'] = [
  { name: 'id', align: 'left', label: 'ID', field: 'codigo' },
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'dias',
    align: 'left',
    label: 'Dias de trabajo',
    field: (row) => getSortedWorkDays(row),
  },
  {
    name: 'inicio1',
    align: 'left',
    label: 'Inicio 1',
    field: 'inicio1',
  },
  {
    name: 'fin1',
    align: 'left',
    label: 'Fin 1',
    field: 'fin1',
  },
  {
    name: 'inicio2',
    align: 'left',
    label: 'Inicio 2',
    field: 'inicio2',
  },
  {
    name: 'fin2',
    align: 'left',
    label: 'Fin 2',
    field: 'fin2',
  },
  {
    name: 'horario1',
    align: 'left',
    label: 'Horario 1',
    field: (row) => `${row.inicio1} - ${row.fin1}`,
  },
  {
    name: 'horario2',
    align: 'left',
    label: 'Horario 2',
    field: (row) => `${row.inicio2} - ${row.fin2}`,
  },
];

onMounted(() => {
  obtenerHorarios(); // Call the function when the component is mounted
});

const visibleColumns = ref(['dias', 'horario1', 'horario2']);

// Methods
const getSortedWorkDays = (row) => {
  const days = Object.keys(row.dias_trabajados)
    .filter((day) => row.dias_trabajados[day] === 'true')
    .sort((a, b) => {
      const order = [
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
        'domingo',
      ];
      return order.indexOf(a) - order.indexOf(b);
    });

  return days.join(', ');
};

const generarDias = () => {
  const dias = {
    lunes: lunes.value ? 'true' : 'false',
    martes: martes.value ? 'true' : 'false',
    miercoles: miercoles.value ? 'true' : 'false',
    jueves: jueves.value ? 'true' : 'false',
    viernes: viernes.value ? 'true' : 'false',
    sabado: sabado.value ? 'true' : 'false',
    domingo: domingo.value ? 'true' : 'false',
  };

  jsonString.value = JSON.stringify(dias);
};

const cerrarDialogo = () => {
  lunes.value = false;
  martes.value = false;
  miercoles.value = false;
  jueves.value = false;
  viernes.value = false;
  sabado.value = false;
  domingo.value = false;

  entrada_uno.value = '00:00';
  salida_uno.value = '00:00';

  entrada_dos.value = '00:00';
  salida_dos.value = '00:00';

  nombre.value = '';
};

const registrarHorario = async (
  nombre: string,
  dias_trabajados: string,
  inicio1: string,
  fin1: string,
  inicio2: string,
  fin2: string
) => {
  try {
    const response = await post(
      '/registrar_turno',
      {},
      JSON.parse(
        JSON.stringify({
          nombre: nombre,
          inicio1: inicio1,
          fin1: fin1,
          inicio2: inicio2,
          fin2: fin2,
          dias_trabajados: dias_trabajados,
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
      cerrarDialogo();
    }
  } catch (error) {
    console.error('Error registrando el horario:', error);
  }
};

const obtenerHorarios = async () => {
  const respuesta = await get('/obtener_turnos', {});
  if (respuesta.error === 'S') {
    rows.value = [];
    return;
  }

  // Check if the response contains data
  if (respuesta.objetos.length === 0) {
    rows.value = [];
  } else {
    rows.value = respuesta.objetos;
  }
};

const eliminarHorario = async (codigo: number) => {
  try {
    const response = await deletes(
      '/eliminar_turno',
      {},

      {
        codigo: codigo,
      }
    );

    if (response.error === 'N') {
      obtenerHorarios();
    }
  } catch (error) {
    console.error('Error eliminando el horario:', error);
  }
};
</script>

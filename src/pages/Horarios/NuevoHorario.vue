<template>
  <div class="row justify-center items-center">
    <div class="column justify-center">
      <div>
        <q-toggle v-model="doble" label="Doble jornada" />
      </div>

      <div style="max-width: 400px">
        <q-input
          outlined
          bottom-slots
          v-model="nombre"
          label="Nombre del horario"
          dense
        >
          <template v-slot:append>
            <q-icon name="close" @click="nombre = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <div class="q-pa-md justify-center">
        <div class="q-gutter-sm column">
          <div>
            <p class="text-subtitle2" style="font-family: 'Oswald'">
              JORNADA 1:
            </p>
          </div>
          <div class="row">
            <div>
              <q-input
                dense
                filled
                v-model="entrada_uno"
                mask="time"
                :rules="['time']"
                label="Hora de entrada"
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
              <q-input
                dense
                filled
                v-model="salida_uno"
                mask="time"
                :rules="['time']"
                label="Hora de salida"
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

        <div class="q-gutter-sm column" v-if="doble">
          <div>
            <p class="text-subtitle2" style="font-family: 'Oswald'">
              JORNADA 2:
            </p>
          </div>
          <div class="row">
            <div>
              <q-input
                dense
                filled
                v-model="entrada_dos"
                mask="time"
                :rules="['time']"
                label="Hora de entrada"
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
              <q-input
                dense
                filled
                v-model="salida_dos"
                mask="time"
                :rules="['time']"
                label="Hora de salida"
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
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-date v-model="days" multiple minimal>
        <div class="row items-center justify-end q-pa-none">
          <q-btn
            class="q-pa-xs"
            label="Borrar"
            color="primary"
            flat
            @click="days = []"
          />
        </div>
      </q-date>
    </div>
  </div>
  <div class="row justify-center items-center q-mb-md">
    <div class="q-px-sm">
      <q-btn
        :disable="days.length == 0"
        color="secondary"
        label="Insertar en calendario"
        @click="handleClick(days)"
      />
    </div>
    <div class="q-px-sm">
      <q-btn
        color="negative"
        label="Borrar calendario"
        @click="handleClickBorrar()"
      />
    </div>
  </div>
  <q-separator inset />
  <CalendarioComponent :events="arrayHorario" />
  <div class="row justify-center items-center q-my-md">
    <q-btn
      v-if="!actualizar"
      @click="registrarHorario(nombre, JSON.stringify(arrayHorario))"
      color="primary"
      label="Guardar horario"
      :disable="nombre === '' || arrayHorario.length == 0"
    />
    <q-btn
      v-if="actualizar"
      @click="actualizarHorario(codigo, nombre, JSON.stringify(arrayHorario))"
      color="primary"
      label="Actualizar horario"
      :disable="nombre === '' || arrayHorario.length == 0"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAxios } from '../../services/useAxios';
import CalendarioComponent from './CalendarioComponent.vue';
import { Calendario } from '../../components/models';

// Data
const days = ref<string[]>([]);
const codigo = ref(0);
const nombre = ref('');
const actualizar = ref(false);
const doble = ref(false);
const entrada_uno = ref('00:00');
const salida_uno = ref('00:00');
const entrada_dos = ref('00:00');
const salida_dos = ref('00:00');
const arrayHorario = ref<Calendario[]>([]);
// const jsonString = ref(JSON.stringify(arrayHorario.value));

const { get, post, put, deletes } = useAxios();
const $q = useQuasar();

/* Defined Props */
const props = defineProps<{
  code: number;
  name: string;
  update: boolean;
  arregloHorario: Calendario[];
}>();

// Methods
onMounted(() => {
  codigo.value = props.code;
  actualizar.value = props.update;
  nombre.value = props.name;
  arrayHorario.value = props.arregloHorario;
});
const convertToHyphenFormat = (dateString: string) => {
  const hyphenatedDate = dateString.replace(/\//g, '-');
  return hyphenatedDate;
};

const calendarioH1 = (dias: string[], entrada1: string, salida1: string) => {
  return dias.map((date) => ({
    title: `${entrada1} ${salida1}`,
    details: 'Horario 1',
    start: convertToHyphenFormat(date),
    end: convertToHyphenFormat(date),
    time: '',
    bgcolor: 'primary',
  }));
};

const calendarioH2 = (
  dias: string[],
  entrada1: string,
  salida1: string,
  entrada2: string,
  salida2: string
) => {
  return dias.map((date) => ({
    title: `${entrada1} ${salida1}`,
    details: 'Horario 1',
    start: convertToHyphenFormat(date),
    end: convertToHyphenFormat(date),
    time: `${entrada2} ${salida2}`,
    bgcolor: 'secondary',
  }));
};

const agregarOReemplazarElemento = (
  array: Calendario[],
  nuevoElemento: Calendario
) => {
  const index = array.findIndex((el) => el.start === nuevoElemento.start);

  if (index !== -1) {
    array.splice(index, 1, nuevoElemento);
  } else {
    array.push(nuevoElemento);
  }
};

const handleClick = (dias: string[]) => {
  if (doble.value) {
    const array2 = calendarioH2(
      dias,
      entrada_uno.value,
      salida_uno.value,
      entrada_dos.value,
      salida_dos.value
    );
    array2.forEach((element) => {
      agregarOReemplazarElemento(arrayHorario.value, element);
    });
  } else {
    const array1 = calendarioH1(dias, entrada_uno.value, salida_uno.value);
    array1.forEach((element) => {
      agregarOReemplazarElemento(arrayHorario.value, element);
    });
  }
};

const handleClickBorrar = () => {
  arrayHorario.value = [];
};

const cerrarDialogo = () => {
  entrada_uno.value = '00:00';
  salida_uno.value = '00:00';

  entrada_dos.value = '00:00';
  salida_dos.value = '00:00';

  nombre.value = '';
  days.value = [];
  arrayHorario.value = [];
  doble.value = false;
};

const registrarHorario = async (nombre: string, horario: string) => {
  try {
    const response = await post(
      '/registrar_horario',
      {},
      JSON.parse(
        JSON.stringify({
          nombre: nombre,
          horario: horario,
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

const actualizarHorario = async (
  codigo: number,
  nombre: string,
  horario: string
) => {
  try {
    const response = await put(
      '/actualizar_horario',
      {},
      JSON.parse(
        JSON.stringify({
          codigo: codigo,
          nombre: nombre,
          horario: horario,
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
</script>

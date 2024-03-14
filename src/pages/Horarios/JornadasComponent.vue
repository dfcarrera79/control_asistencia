<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatearFecha } from '../../services/useWorkDays';

interface Horario {
  end: string;
  time: string;
  start: string;
  title: string;
  bgcolor: string;
  details: string;
}

// Data
const doble = ref(false);
const fecha = ref('');
const entrada_uno = ref('00:00');
const salida_uno = ref('00:00');
const entrada_dos = ref('00:00');
const salida_dos = ref('00:00');

/* Defined Props */
const props = defineProps<{
  horario: Horario[];
}>();

/* Defined Emits */
const emit = defineEmits(['actualizar', 'eliminar']);

// Methods
const actualizar = (
  entrada_uno: string,
  salida_uno: string,
  entrada_dos: string,
  salida_dos: string,
  horario: Horario[]
) => {
  if (!doble.value) {
    horario[0].title = `${entrada_uno} ${salida_uno}`;
    horario[0].time = '';
    horario[0].bgcolor = 'primary';
  } else {
    horario[0].title = `${entrada_uno} ${salida_uno}`;
    horario[0].bgcolor = 'secondary';
    if (entrada_dos == '00:00' && salida_dos == '00:00') {
      horario[0].time = '';
    } else {
      horario[0].time = `${entrada_dos} ${salida_dos}`;
    }
  }

  emit('actualizar', {
    horario,
  });
};

const eliminar = (horario: Horario[]) => {
  console.log('[ELIMINAR]: ', JSON.stringify(horario));
  emit('eliminar', {
    horario,
  });
};

onMounted(() => {
  fecha.value = formatearFecha(props.horario[0].end);
  if (props.horario[0]) {
    entrada_uno.value = props.horario[0].title.slice(0, 5);
    salida_uno.value = props.horario[0].title.slice(6);

    if (props.horario[0].time !== '') {
      doble.value = true;
      entrada_dos.value = props.horario[0].time.slice(0, 5);
      salida_dos.value = props.horario[0].time.slice(6);
    }
  }
});
</script>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="column justify-center">
        <div class="row">
          <q-toggle v-model="doble" label="Doble jornada" />
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="justify-center">
          <h5 class="q-pa-xs q-ma-xs text-primary text-center">
            {{ fecha }}
          </h5>
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
    </q-card-section>
    <q-card-section>
      <div class="row justify-center items-center q-mb-md">
        <div class="q-px-sm">
          <q-btn
            color="secondary"
            label="Actualizar en calendario"
            @click="
              actualizar(
                entrada_uno,
                salida_uno,
                entrada_dos,
                salida_dos,
                props.horario
              )
            "
          />
        </div>
        <div class="q-px-sm">
          <q-btn
            color="negative"
            label="Borrar de calendario"
            @click="eliminar(props.horario)"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 550px
</style>

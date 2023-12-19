<template>
  <div class="column justify-center">
    <div>
      <div>
        <q-toggle v-model="doble" label="Doble jornada" />
      </div>

      <div class="q-pa-md justify-center">
        <div style="max-width: 400px">
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
      <div class="q-pb-sm">Model: {{ days }}</div>

      <q-date v-model="days" multiple minimal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const days = ref([]);
const nombre = ref('');
const doble = ref(false);
const entrada_uno = ref('00:00');
const salida_uno = ref('00:00');
const entrada_dos = ref('00:00');
const salida_dos = ref('00:00');
</script>

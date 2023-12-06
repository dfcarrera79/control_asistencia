<template>
  <q-layout view="lHh Lpr lFf">
    <q-header unelevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          class="text-h4 row text-uppercase"
          style="font-family: 'Bebas Neue'"
        >
          Control de asistencia
        </q-toolbar-title>

        <div class="row items-center content-center q-mr-md">
          <q-toggle
            :model-value="dark.isActive"
            checked-icon="dark_mode"
            unchecked-icon="light_mode"
            size="3rem"
            @update:model-value="(val) => dark.set(val)"
          />
          <q-btn flat dense @click="cerrarSesion">
            <div class="q-mr-sm" v-if="!($q.screen.lt.md || $q.screen.lt.sm)">
              Salir
            </div>
            <q-icon left name="logout" />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="320"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-img
        fit="fill"
        class="absolute-top q-pa-sm"
        src="../assets/loxasoluciones.png"
        style="height: 150px"
        v-show="!miniState"
      />
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item class="column" v-show="!miniState">
            <q-separator inset />
            <div
              style="
                color: #636466;
                width: 300px;
                white-space: wrap;
                overflow: hidden;
              "
            >
              <div style="color: #636466" class="text-center">
                Bienvenido(a)
              </div>
              <div class="text-weight-bold text-center" style="color: #636466">
                {{ sessionData.usuario }}
              </div>
            </div>
            <q-separator inset />
          </q-item>

          <q-item clickable v-ripple to="/" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="home" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                PÁGINA DE INICIO
              </span>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            v-ripple
            to="/gestion_usuarios"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="people_alt" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                GESTIÓN DE EMPLEADOS
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/registros_biometricos"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="person_pin" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                REGISTROS BIOMÉTRICOS
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/configuracion_horarios"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="schedule" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                CONFIGURACIÓN DE HORARIOS
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/gestion_exepciones"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="ballot" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                GESTIÓN DE EXEPCIONES
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/horas_suplementarias"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="more_time" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                Registro de horas suplementarias
              </span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/registro_asistencias"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="how_to_reg" color="grey-9" />
            </q-item-section>

            <q-item-section>
              <span
                class="text-grey-9 text-h6"
                style="font-family: 'Bebas Neue'"
              >
                REGISTRO DE ASISTENCIAS
              </span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import jwtDecode from 'jwt-decode';
import { LocalStorage, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { DarkMode, TokenDecoded } from '../components/models';

// Data
const { dark } = useQuasar();
const expires = ref('');
const router = useRouter();
const miniState = ref(true);
const authStore = useAuthStore();
const darkMode = ref(false);

const sessionData = LocalStorage.getItem('session');

// Methods
const cerrarSesion = () => {
  // win.location = 'https://www.loxasoluciones.com/';
  router.push('/login');
  LocalStorage.clear();
};

const checkTokenExpiration = () => {
  const token = authStore.token;
  const decodedToken: TokenDecoded = jwtDecode(token);
  const expirationTimestamp = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const tokenExpirationTime = expirationTimestamp - currentTime;

  if (decodedToken.exp < currentTime) {
    // Token has expired, log the user out
    cerrarSesion();
  } else {
    // Calculate remaining time
    const remainingTime = tokenExpirationTime * 1000; // Convert to milliseconds

    const remainingMinutes = Math.floor(remainingTime / 60000); // 1 minute = 60,000 milliseconds
    const remainingSeconds = Math.floor((remainingTime % 60000) / 1000); // Remaining seconds

    expires.value = `Token expires in ${remainingMinutes} minutes and ${remainingSeconds} seconds`;
  }
};

// Check token expiration every 5 minutes (300,000 milliseconds)
const tokenExpirationCheckInterval = setInterval(checkTokenExpiration, 300000);

checkTokenExpiration();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

watch(
  () => dark.isActive,
  (val) => {
    authStore.setDarkModeFromLocalStorage(val);

    // Guardar el estado de dark.isActive en el LocalStorage
    LocalStorage.set('darkMode', { darkMode: val });
  }
);

// Recuperar el estado de dark.isActive del LocalStorage al iniciar la aplicación
onMounted(() => {
  const session: DarkMode | null = LocalStorage.getItem('darkMode');
  darkMode.value = session?.darkMode || false;
  if (session?.darkMode !== null) {
    dark.set(darkMode.value);
  }
});
</script>

<style lang="sccs" scoped></style>

<template>
  <q-page class="flex flex-center bg-image">
    <q-dialog v-model="mostrarVentana" persistent>
      <q-card>
        <div class="row bg-blue-8 justify-center q-pa-xs">
          <span
            class="text-h6 text-center text-white"
            style="font-family: 'Bebas Neue'"
            >Cambiar clave de acceso</span
          >
        </div>
        <q-card-section>
          <q-input
            v-model="ruc"
            debounce="750"
            label="RUC | CI | Pasaporte"
            dense
            :rules="rucRule"
            @input="fetchEmail"
          />
          <q-input
            v-model="correoElectronico"
            debounce="750"
            label="Email"
            dense
            :rules="emailRule"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Enviar"
            @click="enviarCorreoRecuperacion()"
          />
          <q-btn
            flat
            class="text-blue-grey"
            label="Cerrar"
            @click="mostrarVentana = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-card class="shadow-8 bg-white" style="width: 300px; height: 260px">
      <div class="row bg-blue-8 justify-center q-pa-xs">
        <span
          class="text-h6 text-center text-white"
          style="font-family: 'Bebas Neue'"
          >PORTAL DE CONTROL DE ASISTENCIA V0.1</span
        >
      </div>
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-input v-model="id" type="text" label="Usuario" dense />
        </div>
        <div class="column col-xs-12 q-pa-sm">
          <q-input
            v-model="clave"
            dense
            :type="isPwd ? 'password' : 'text'"
            label="Clave de acceso"
            @keyup.enter="logearse()"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
              <q-tooltip
                class="bg-grey-6 text-caption"
                anchor="bottom middle"
                self="center middle"
              >
                {{ isPwd ? 'Mostrar clave' : 'Ocultar clave' }}
              </q-tooltip>
            </template>
          </q-input>
        </div>
      </div>
      <q-separator dark />
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-btn
            class="full-width text-white"
            style="height: 40px"
            color="blue"
            label="Ingresar"
            @click="logearse()"
          />
        </div>
      </div>

      <!-- <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <a
            class="full-width q-link"
            style="
              display: block;
              height: 40px;
              line-height: 40px;
              text-align: center;
            "
            @click="recuperarContraseña()"
          >
            <span class="hover-primary text-bold text-blue-grey"
              >¿OLVIDASTE TU CONTRASEÑA?</span
            >
          </a>
        </div>
      </div> -->
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Session } from '../components/models';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAxios } from '../services/useAxios';
import { useMensajes } from '../services/useMensajes';
import { LocalStorage, Loading, QSpinnerFacebook } from 'quasar';

const { get, put } = useAxios();
const authStore = useAuthStore();
const { mostrarMensaje } = useMensajes();
const id = ref('');
const ruc = ref('');
const clave = ref('');
const isPwd = ref(true);
const router = useRouter();
const url = ref(authStore.url);
const mostrarVentana = ref(false);
const correoElectronico = ref('');
const newUrl = ref(url.value.slice(url.value.indexOf('#') + 1));
const token = ref('');
const usuario = ref('');
const codigo = ref(0);

const rucRule: ((v: string) => string | boolean)[] = [
  (v: string) => !!v || 'El RUC es obligatorio',
  (v: string) => /^\d{13}$/.test(v) || 'El RUC debe contener 13 dígitos',
];

const emailRule: ((v: string) => string | boolean)[] = [
  (v: string) => !!v || 'El correo electrónico es obligatorio',
  (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    'Formato de correo electrónico inválido',
];

onMounted(() => {
  const session: Session | null = LocalStorage.getItem('session');
  token.value = session?.token || '';
  usuario.value = session?.usuario || '';
  codigo.value = session?.codigo || 0;

  if (session) {
    authStore.iniciarSesion(token.value, usuario.value, codigo.value);
    router.push(newUrl.value);
  }
});

const logearse = async () => {
  if (id.value.trim().length === 0) {
    mostrarMensaje(
      'Error',
      'Es necesario ingresar su número de RUC o identificación'
    );
    return;
  }
  if (clave.value.trim().length === 0) {
    mostrarMensaje('Error', 'Es obligatorio ingresar su clave de acceso');
    return;
  }
  Loading.show({
    spinner: QSpinnerFacebook,
    message: 'Verificando acceso...',
  });
  const respuesta = await get('/validar_usuario', {
    id: id.value,
    clave: clave.value,
    sys: 1,
  });
  Loading.hide();
  if (respuesta.error === 'S') {
    mostrarMensaje('Error', respuesta.mensaje);
    return;
  }
  authStore.actualizarUsuario(
    respuesta.objetos[0].usu_nomape,
    respuesta.objetos[0].codigo
  );
  authStore.iniciarSesion(
    respuesta.token,
    respuesta.objetos[0].usu_nomape,
    respuesta.objetos[0].codigo
  );
  router.push('/');
};

const recuperarContraseña = () => {
  mostrarVentana.value = true;
};

const fetchEmail = async () => {
  try {
    const respuesta = await get('/obtener_usuario', {
      id: ruc.value,
    });

    // Assuming the response data has a property 'email' containing the email address
    correoElectronico.value = respuesta.objetos;
  } catch (error) {
    console.error('Error fetching email:', error);
  }
};

watch(ruc, fetchEmail);

const enviarCorreoRecuperacion = async () => {
  try {
    const response = await put(
      '/resetear_clave_acceso',
      {},
      JSON.parse(
        JSON.stringify({
          email: correoElectronico.value,
          ruc: ruc.value,
        })
      )
    );

    // Handle the response accordingly
    console.log(response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
</script>

<style scoped>
.hover-primary:hover {
  color: #1976d2;
}
.bg-image {
  background-image: url('../assets/background.jpg');
  background-repeat: repeat;
  background-size: cover;
}
</style>

// import { defineStore } from 'pinia';
// import { LocalStorage } from 'quasar';

// export const useAuthStore = defineStore('counter', {
//   state: () => ({
//     API_URL: process.env.API_URL,
//     estaLogeado: false,
//     url: window.location.href,
//     token: '',
//     usuario: '',
//     codigo: 0,
//     acceso: false,
//     darkMode: false,
//   }),

//   getters: {
//     getURLApi(state) {
//       return state.API_URL;
//     },
//     getHttpHeaders(state) {
//       return {
//         'Content-Type': 'application/json',
//         token: state.token,
//         usucodigo: state.codigo,
//       };
//     },
//     getUsuario(state) {
//       return state.usuario;
//     },
//     getCodigo(state) {
//       return state.codigo;
//     },
//   },

//   actions: {
//     setDarkMode(dark: boolean) {
//       this.darkMode = dark;
//     },
//     iniciarSesion(token: string, usuario: string, codigo: number) {
//       this.estaLogeado = true;
//       this.token = token;
//       this.usuario = usuario;
//       this.codigo = codigo;
//       LocalStorage.set('session', {
//         estaLogeado: this.estaLogeado,
//         currentURL: this.url,
//         token: this.token,
//         usuario: this.usuario,
//         codigo: this.codigo,
//         darkMode: this.darkMode,
//       });
//     },
//     actualizarUsuario(newUsuario: string, newCodigo: number) {
//       this.usuario = newUsuario;
//       this.codigo = newCodigo;
//     },
//     setDarkModeFromLocalStorage(dark: boolean) {
//       const session = LocalStorage.getItem('session');
//       if (session) {
//         this.darkMode = dark;
//       }
//     },
//   },
// });

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('store', () => {
  // state
  const API_URL = ref(process.env.API_URL);
  const estaLogeado = ref(false);
  const url = ref(window.location.href);
  const token = ref('');
  const usuario = ref('');
  const codigo = ref(0);
  const acceso = ref(false);
  const darkMode = ref(false);

  // getters
  const getURLApi = computed(() => API_URL.value);

  const getHttpHeaders = computed(() => ({
    'Content-Type': 'application/json',
    token: token.value,
    usucodigo: codigo.value,
  }));

  const getUsuario = computed(() => usuario.value);

  const getCodigo = computed(() => codigo.value);

  // actions
  const setDarkMode = (dark: boolean) => {
    darkMode.value = dark;
  };

  const iniciarSesion = (tok: string, usu: string, cod: number) => {
    estaLogeado.value = true;
    token.value = tok;
    usuario.value = usu;
    codigo.value = cod;

    LocalStorage.set('session', {
      estaLogeado: estaLogeado.value,
      currentURL: url.value,
      token: token.value,
      usuario: usuario.value,
      codigo: codigo.value,
      darkMode: darkMode.value,
    });
  };

  const actualizarUsuario = (newUsuario: string, newCodigo: number) => {
    usuario.value = newUsuario;
    codigo.value = newCodigo;
  };

  const setDarkModeFromLocalStorage = (dark: boolean) => {
    const session = LocalStorage.getItem('session');
    if (session) {
      darkMode.value = dark;
    }
  };
  return {
    API_URL,
    estaLogeado,
    url,
    token,
    usuario,
    codigo,
    acceso,
    darkMode,
    getURLApi,
    getHttpHeaders,
    getUsuario,
    getCodigo,
    setDarkMode,
    iniciarSesion,
    actualizarUsuario,
    setDarkModeFromLocalStorage,
  };
});

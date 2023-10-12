import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('counter', {
  state: () => ({
    API_URL: process.env.API_URL,
    estaLogeado: false,
    url: window.location.href,
    token: '',
    usuario: '',
    codigo: 0,
  }),

  getters: {
    getURLApi(state) {
      return state.API_URL;
    },
    getHttpHeaders(state) {
      return {
        'Content-Type': 'application/json',
        token: state.token,
      };
    },
    getUsuario(state) {
      return state.usuario;
    },
    getCodigo(state) {
      return state.codigo;
    },
  },

  actions: {
    iniciarSesion(token: string, usuario: string, codigo: number) {
      this.estaLogeado = true;
      this.token = token;
      this.usuario = usuario;
      this.codigo = codigo;
      LocalStorage.set('session', {
        estaLogeado: this.estaLogeado,
        currentURL: this.url,
        token: this.token,
        usuario: this.usuario,
        codigo: this.codigo,
      });
    },
    actualizarUsuario(newUsuario: string, newCodigo: number) {
      this.usuario = newUsuario;
      this.codigo = newCodigo;
    },
  },
});

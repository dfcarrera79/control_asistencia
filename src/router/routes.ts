import { useAuthStore } from '../stores/auth';
import multiguard from 'vue-router-multiguard';
import {
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';

const estaLogeado = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const appStore = useAuthStore();
  if (appStore.estaLogeado === false) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  return next();
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/configuracion_horarios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Horarios/HorariosPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/gestion_usuarios',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Usuarios/UsuariosPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/gestion_exepciones',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Exepciones/ExepcionesPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/registro_asistencias',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Asistencias/AsistenciasPage.vue'),
        beforeEnter: multiguard([estaLogeado]),
      },
    ],
  },

  {
    path: '/cambiar_clave/:ruc',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CambiarClavePage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "painel",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/categorias",
        component: () => import("pages/categorias/Categorias.vue"),
      },
      {
        path: "/clientes",
        component: () => import("pages/clientes/Clientes.vue"),
      },
      {
        path: "/cliente/novo",
        component: () => import("pages/clientes/NewCliente.vue"),
      },
      {
        path: "cliente/editar/:id",
        component: () => import("pages/clientes/EditCliente.vue"),
      },
      {
        path: "/fornecedores",
        component: () => import("pages/fornecedores/Fornecedores.vue"),
      },
      {
        path: "/fornecedor/novo",
        component: () => import("pages/fornecedores/NewFornecedor.vue"),
      },
      {
        path: "fornecedor/editar/:id",
        component: () => import("pages/fornecedores/EditFornecedor.vue"),
      },
      {
        path: "/produtos",
        component: () => import("pages/produtos/Produtos.vue"),
      },
      {
        path: "/produto/novo",
        component: () => import("pages/produtos/NewProduto.vue"),
      },
      {
        path: "produto/editar/:id",
        component: () => import("pages/produtos/EditProduto.vue"),
      }
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("pages/login/Login.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

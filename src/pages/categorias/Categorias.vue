<template>
    <q-page class="bg-gray-3 column q-pa-md">
      <div class="q-pa-sm">
        <q-table
          title="Categorias"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          hide-pagination
          :pagination="configPagination"
        >
          <template v-slot:body-cell-action="props">
            <q-td auto-width :props="props">
              <q-btn
                clickable
                dense
                round
                color="primary"
                icon="edit"
                @click="editCategoria(props.row)"
              />
            </q-td>
          </template>
  
          <template v-slot:top>
            <div class="text-h5">Categorias</div>
            <q-btn
              color="primary"
              round
              icon="add"
              title="Cadastrar"
              class="q-ml-sm"
              @click="newCategoria()"
            />
            <q-space />
          </template>
        </q-table>
      </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useQuasar } from "quasar";
  import { api } from "src/boot/axios";
  import modalNewCategoria from "src/pages/categorias/NewCategoria.vue";
  import modalEditCategoria from "src/pages/categorias/EditCategoria.vue";
  
  defineOptions({
    name: "CategoriasPage",
  });
  
  const columns: any = [
    {
      name: "id",
      required: true,
      label: "#",
      align: "left",
      field: "id",
    },
    {
      name: "nome",
      align: "left",
      label: "Nome",
      field: "nome",
    },
    {
      name: "descricao",
      align: "center",
      label: "Descrição",
      field: "descricao",
    },
    {
      name: "action",
      label: "Ações",
      align: "center",
    },
  ];
  
  const $q = useQuasar();
  
  const rows = ref([]);
  const loading = ref(false);
  
  const configPagination = {
    page: 1,
    rowsPerPage: 0,
  };
  
  onMounted(() => {
    getData();
  });
  
  async function getData() {
    loading.value = true;
    api
      .get("/categorias")
      .then(function (response) {
        rows.value = response.data;
  
        loading.value = false;
      })
      .then(function () {
        loading.value = false;
      });
  }
  
  function editCategoria(payload: any) {
    $q.dialog({
      component: modalEditCategoria,
      componentProps: {
        payload: payload,
      },
    }).onOk(() => {
      getData();
    });
  }
  
  function newCategoria() {
    $q.dialog({
      component: modalNewCategoria,
    }).onOk(() => {
      getData();
    });
  }
  </script>
  
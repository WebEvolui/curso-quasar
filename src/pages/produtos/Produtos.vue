<template>
  <q-page class="bg-gray-3 column q-pa-md">
    <div class="q-pa-sm">
      <q-table
        title="Produtos"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        @request="onRequest"
        :rows-per-page-options="[]"
      >
        <template v-slot:body-cell-action="props">
          <q-td auto-width :props="props">
            <q-btn
              clickable
              dense
              round
              color="primary"
              title="Editar produto"
              icon="edit"
              @click="editProduto(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:top>
          <div class="text-h5">Produtos</div>
          <q-btn
            color="primary"
            round
            icon="add"
            title="Cadastrar"
            class="q-ml-sm"
            @click="newProduto()"
          />

          <q-space />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { formatMoney } from "src/helpers/formats.js";

defineOptions({
  name: "ProdutosPage",
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
    align: "left",
    label: "Descrição",
    field: "descricao",
  },
  {
    name: "preco",
    align: "center",
    label: "Preço",
    field: (row: any) => formatMoney(row.preco),
  },
  {
    name: "estoque",
    align: "center",
    label: "Estoque",
    field: "estoque",
  },
  {
    name: "Categoria",
    align: "left",
    label: "Categoria",
    field: (row: any) => row.categoria.nome,
  },
  {
    name: "action",
    label: "Ações",
    align: "center",
  },
];

const router = useRouter();

const rows = ref([]);
const loading = ref(false);

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

function onRequest(props: any) {
  const { page } = props.pagination;

  let url = "/produtos";
  if (page) url += "?page=" + page;

  loading.value = true;

  api
    .get(url)
    .then(function (response) {
      pagination.value.rowsNumber = response.data.total;
      rows.value = response.data.data;
      pagination.value.page = response.data.current_page;
      pagination.value.rowsPerPage = response.data.per_page;

      loading.value = false;
    })
    .then(function () {
      loading.value = false;
    });
}

function newProduto() {
  router.push({ path: `/produto/novo` });
}

function editProduto(payload: any) {
  router.push({ path: `/produto/editar/${payload.id}` });
}
</script>

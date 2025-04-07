<template>
  <q-page class="bg-gray-3 column q-pa-md">
    <div class="q-pa-sm">
      <q-table
        title="Fornecedores"
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
              title="Editar fornecedor"
              icon="edit"
              @click="editFornecedor(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:top>
          <div class="text-h5">Fornecedores</div>
          <q-btn
            color="primary"
            round
            icon="add"
            title="Cadastrar"
            class="q-ml-sm"
            @click="newFornecedor()"
          />

          <q-space />

          <q-input
            outlined
            v-model="cnpjFiltro"
            label="Pesquisar CNPJ"
            dense
            mask="##.###.###/####-##"
            unmasked-value
            lazy-rules
            :rules="[
              (val) => !val || (val && val.length == 14) || 'CNPJ inválido',
            ]"
            @keyup.enter="buscaFornecedor()"
          >
            <template v-slot:append>
              <q-btn icon="search" flat round @click="buscaFornecedor()" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { formatCNPJ, formatPhone } from "src/helpers/formats.js";

defineOptions({
  name: "FornecedoresPage",
});

const columns: any = [
  {
    name: "action",
    label: "Ações",
    align: "center",
  },
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: "id",
  },
  {
    name: "cnpj",
    align: "center",
    label: "CNPJ",
    field: "cnpj",
    format: (val: string) => formatCNPJ(val),
  },
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
  },
  {
    name: "telefone",
    align: "center",
    label: "Contato",
    field: "telefone",
    format: (val: any) => formatPhone(val),
  },
  {
    name: "email",
    align: "center",
    label: "E-mail",
    field: "email",
  },
  {
    name: "endereco",
    align: "left",
    label: "Endereço",
    field: "endereco",
  },
  {
    name: "contato",
    align: "left",
    label: "Contato",
    field: "contato",
  },
];

const router = useRouter();

const cnpjFiltro = ref("");

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

function buscaFornecedor() {
  if (cnpjFiltro.value.length > 0 && cnpjFiltro.value.length != 14) {
    return;
  }

  onRequest({
    pagination: pagination.value,
  });
}

function onRequest(props: any) {
  const { page } = props.pagination;

  let url = "/fornecedores";
  if (page) url += "?page=" + page;
  if (cnpjFiltro.value != "") url += "&cnpj=" + cnpjFiltro.value;

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

function newFornecedor() {
  router.push({ path: `/fornecedor/novo` });
}

function editFornecedor(payload: any) {
  router.push({ path: `/fornecedor/editar/${payload.id}` });
}
</script>

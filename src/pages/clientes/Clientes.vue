<template>
  <q-page class="bg-gray-3 column q-pa-md">
    <div class="q-pa-sm">
      <q-table
        title="Clientes"
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
              title="Editar cliente"
              icon="edit"
              @click="editCliente(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:top>
          <div class="text-h5">Clientes</div>
          <q-btn
            color="primary"
            round
            icon="add"
            title="Cadastrar"
            class="q-ml-sm"
            @click="newCliente()"
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
import { formatCNPJ, formatCPF, formatPhone } from "src/helpers/formats.js";

defineOptions({
  name: "ClientesPage",
});

const columns: any = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: (row: { id: any }) => row.id,
  },
  {
    name: "cpf_cnpj",
    align: "center",
    label: "Documento",
    field: (row: any) =>
      row.cpf_cnpj.length === 11
        ? formatCPF(row.cpf_cnpj)
        : row.cpf_cnpj.length === 14
        ? formatCNPJ(row.cpf_cnpj)
        : row.cpf_cnpj,
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

  let url = "/clientes";
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

function newCliente() {
  router.push({ path: `/cliente/novo` });
}

function editCliente(payload: any) {
  router.push({ path: `/cliente/editar/${payload.id}` });
}
</script>

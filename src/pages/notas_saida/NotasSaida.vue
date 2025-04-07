<template>
  <q-page class="bg-gray-3 column q-pa-md">
    <div class="q-pa-sm">
      <q-table
        title="Notas de Saída"
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
              color="primary"
              round
              dense
              title="Editar nota"
              icon="edit"
              @click="editNota(props.row)"
            />

            <q-btn
              clickable
              color="negative"
              round
              dense
              title="Deletar nota"
              icon="delete"
              class="q-ml-sm"
              @click="deletarNota(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:top>
          <div class="text-h5">Notas de saída</div>
          <q-btn
            color="primary"
            round
            icon="add"
            title="Cadastrar"
            class="q-ml-sm"
            @click="newNota()"
          />

          <q-space />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { formatMoney } from "src/helpers/formats.js";

defineOptions({
  name: "NotasSaidaPage",
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
    name: "cliente",
    align: "left",
    label: "Cliente",
    field: (row: any) => row.cliente.nome,
  },
  {
    name: "data",
    align: "left",
    label: "Data",
    field: (rows: any) => {
      const date = new Date(rows.data);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    name: "total",
    align: "center",
    label: "Total",
    field: (row: any) => formatMoney(row.total),
  },
  {
    name: "action",
    label: "Ações",
    align: "center",
  },
];

const $q = useQuasar();
const router = useRouter();

const rows = ref([]);
const loading = ref(false);

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

onMounted(() => {
  pagination.value.page = Number(router.currentRoute.value.query.page) || 1;

  onRequest({ pagination: pagination.value });
});

function onRequest(props: any) {
  const { page } = props.pagination;

  let url = "/notas-venda";
  if (page) url += `?page=${page}`;

  router.replace({ path: "/notas_saida", query: { page: String(page) } });

  loading.value = true;

  api
    .get(url)
    .then((response) => {
      pagination.value.rowsNumber = response.data.total;
      rows.value = response.data.data;
      pagination.value.page = response.data.current_page;
      pagination.value.rowsPerPage = response.data.per_page;

      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
}

function newNota() {
  router.push({ path: "/nota_saida/nova" });
}

function editNota(payload: any) {
  router.push({
    path: `/nota_saida/editar/${payload.id}`,
    query: { page: router.currentRoute.value.query.page },
  });
}

function deletarNota(payload: any) {
  $q.dialog({
    title: "Deletar nota de saída",
    message: `Deseja realmente deletar a nota de saída ${payload.id}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    api.delete(`/notas-venda/${payload.id}`).then((response) => {
      if (response.status == 204) {
        onRequest({ pagination: pagination.value });
      }
    });
  });
}
</script>

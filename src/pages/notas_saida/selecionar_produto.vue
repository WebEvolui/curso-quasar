<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin"
      style="width: 700px; max-width: 700px; height: 550px"
    >
      <div class="q-pa-sm">
        <q-table
          dense
          :rows="rows"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          :rows-per-page-options="[]"
        >
          <template v-slot:body-cell-action="props">
            <q-td auto-width :props="props">
              <q-btn
                clickable
                dense
                round
                color="positive"
                icon="done"
                @click="selecionarProduto(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="text-h6">Produtos</div>
            <q-space />
            <q-input
              style="width: 350px"
              outlined
              color="primary"
              v-model.trim="filter"
              debounce="500"
              @keypress.capture.enter="
                onRequest({
                  pagination: pagination,
                  filter: filter,
                })
              "
              label="Pesquisar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import { api } from "boot/axios";
import { formatMoney } from "src/helpers/formats";

const columns: any = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: "id",
  },
  { name: "nome", align: "center", label: "Nome", field: "nome" },
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
    name: "action",
    label: "Selecionar",
    align: "center",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

const filter = ref("");
const loading = ref(false);
const rows = ref([]);

function onRequest(props: any) {
  const { page } = props.pagination;
  const filter = props.filter;

  let url = "/produtos";
  if (page) url += "?page=" + page;
  if (filter) url += "&nome=" + filter;

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

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    function selecionarProduto(row: any) {
      onDialogOK({
        produto_id: row.id,
        nome: row.nome,
        preco: row.preco,
        estoque: row.estoque,
      });
    }

    onMounted(() => {
      onRequest({
        pagination: pagination.value,
        filter: "",
      });
    });

    return {
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      onRequest,
      columns,
      rows,
      pagination,
      loading,
      filter,
      selecionarProduto,
    };
  },
};
</script>

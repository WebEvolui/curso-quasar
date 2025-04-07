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
                @click="selecionarCliente(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="text-h6">Cliente</div>
            <q-space />
            <div class="bg-grey-1 q-pa-sm q-ml-sm rounded-borders">
              <q-radio v-model="tipoPesquisa" val="nome" label="Nome" />
              <q-radio v-model="tipoPesquisa" val="cnpj_cpf" label="CNPJ/CPF" />
            </div>
            <q-input
              style="width: 300px"
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
              class="q-ml-sm"
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
import { api } from "src/boot/axios";

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
    name: "cpf_cnpj",
    align: "center",
    label: "Documento",
    field: "cpf_cnpj",
  },
  {
    name: "action",
    label: "Ações",
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
const tipoPesquisa = ref("nome");

function onRequest(props: any) {
  const { page } = props.pagination;
  const filter = props.filter;

  let url = "/clientes";

  if (page) url += "?page=" + page;

  if (filter && tipoPesquisa.value == "nome") {
    url += "&nome=" + filter;
  } else if (filter && tipoPesquisa.value == "cnpj_cpf") {
    url += "&cpf_cnpj=" + filter;
  }

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

    function selecionarCliente(row: any) {
      onDialogOK({
        cliente_id: row.id,
        nome: row.nome,
        cnpj_cpf: row.cpf_cnpj,
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
      selecionarCliente,
      tipoPesquisa,
    };
  },
};
</script>

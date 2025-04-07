<template>
  <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      ref="formNota"
    >
      <div class="row">
        <div class="text-h5">Cadastrar Nova Nota de saída</div>
      </div>

      <div class="row">
        <div class="col">
          <q-input
            outlined
            color="primary"
            v-model.trim="state.nota.cliente.nome"
            @click="buscarCliente()"
            placeholder="Pesquisar Cliente"
            readonly
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="row">
        <q-btn
          clickable
          color="primary"
          label="Adicionar item"
          @click="addItem()"
        />
      </div>

      <div class="row q-mt-md">
        <div class="col">
          <q-table
            :rows="rows"
            :columns="columns"
            :loading="loading"
            row-key="id"
            hide-pagination
            :pagination="pagination"
            no-data-label="Nenhum item adicionado ainda na nota"
          >
            <template v-slot:body-cell-quantidade="props">
              <q-td
                :class="props.row.quantidade == 0 ? 'bg-secondary' : ''"
                :props="props"
              >
                {{ props.row.quantidade }}
                <q-popup-edit
                  v-model.number="props.row.quantidade"
                  title="Atualizar quantidade"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model="scope.value"
                    :min="1"
                    :max="props.row.estoque"
                    dense
                    autofocus
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
            </template>

            <template v-slot:body-cell-preco="props">
              <q-td
                :class="props.row.preco == 0 ? 'bg-secondary' : ''"
                :props="props"
              >
                {{ formatMoney(props.row.preco) }}
                <q-popup-edit
                  v-model="props.row.preco"
                  title="Atualizar preço"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    v-model="scope.value"
                    :min="1"
                    :max="props.row.preco"
                    dense
                    autofocus
                    @keyup.enter="scope.set"
                    @keypress="(e: any) => {
                      if (e.key === ',') {
                        e.preventDefault();
                      }
                    }"
                  />
                </q-popup-edit>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  clickable
                  round
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="deleteItem(props.row.produto_id)"
                  title="Excluir"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <div class="row float-right">
        <div class="text-h5 q-ml-lg">
          <span class="text-weight-bold">Total:</span>
          {{ showMoney(state.nota.valor_total) }}
        </div>
      </div>

      <div class="row">
        <q-btn label="Cadastrar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { formatMoney } from "src/helpers/formats";
import { showMoney } from "src/helpers/money";
import modalNewItem from "./selecionar_produto.vue";
import modalSelecionarCliente from "./selecionar_cliente.vue";

const columns: any = reactive([
  {
    name: "produto",
    label: "Produto",
    field: "produto",
  },
  {
    name: "quantidade",
    label: "Quantidade",
    field: "quantidade",
  },
  {
    name: "preco",
    label: "Preço",
    field: (row: any) => showMoney(row.preco),
  },
  {
    name: "valor_total",
    label: "Total",
    field: (row) => showMoney(row.valor_total),
  },
  {
    name: "action",
    label: "Ações",
    align: "right",
  },
]);

const loading = ref(false);
const state = reactive({
  nota: {
    cliente: {
      id: ref(null),
      nome: ref(null),
    },
    valor_total: 0,
  },
});

const rows: any = reactive([]);
watch(
  rows,
  () => {
    calcularValores();
  },
  { deep: true }
);

const pagination = {
  page: 1,
  rowsPerPage: 0,
};

const formNota = ref(null);

const $q = useQuasar();
const router = useRouter();

function calcularValores() {
  let valorTotal = 0;

  rows.map((row: any) => {
    if (row.quantidade > row.estoque) {
      row.quantidade = row.estoque;
    }

    row.valor_total = row.quantidade * row.preco;

    valorTotal += row.valor_total;
  });

  state.nota.valor_total = valorTotal;
}

function onSubmit() {
  if (state.nota.cliente.id == null) {
    $q.dialog({
      title: "Atenção",
      message: "Selecione um cliente",
      color: "red",
    }).onOk(() => {
      buscarCliente();
    });
    return;
  }

  if (rows.length == 0) {
    $q.dialog({
      title: "Atenção",
      message: "Adicione pelo menos um item",
      color: "red",
    }).onOk(() => {
      addItem();
    });
    return;
  }

  $q.loading.show();

  let arrayProdutos: any = [];
  rows.map((row: any) => {
    arrayProdutos.push({
      produto_id: row.produto_id,
      quantidade: row.quantidade,
      preco_unitario: row.preco,
    });
  });

  api
    .post("/notas-venda", {
      cliente_id: state.nota.cliente.id,
      data: new Date(),
      itens: arrayProdutos,
    })
    .then((response) => {
      if (response.status == 201) {
        $q.notify({
          color: "positive",
          textColor: "white",
          message: "Nota de saída cadastrada com sucesso!",
        });

        // @ts-ignore
        formNota.value.reset();
        $q.loading.hide();

        router.push("/notas_saida");
      }
    })
    .catch((error) => {
      console.log(error.response.data);
      $q.notify({
        type: "negative",
        message:
          "Não foi possível fazer o cadastro, alguma informação está errada!",
      });
    })
    .then(() => {
      $q.loading.hide();
    });
}

function addItem() {
  $q.dialog({
    component: modalNewItem,
  }).onOk((data) => {
    
    let produtoAlreadyAdded = false;

    const promise = rows.map((row: any) => {
      if (row.produto_id == data.produto_id) {
        produtoAlreadyAdded = true;
        $q.dialog({
          title: "Atenção",
          message: "Produto já adicionado, edite a quantidade ou remova",
          color: "red",
        });
        return;
      }
    });

    Promise.all(promise);

    if (produtoAlreadyAdded == false) {
      rows.push({
        produto_id: data.produto_id,
        produto: data.nome,
        preco: data.preco,
        quantidade: 1,
        estoque: data.estoque,
      });
    }
  });
}

function deleteItem(id: number) {
  rows.splice(
    rows.findIndex((row: any) => row.produto_id == id),
    1
  );
}

function buscarCliente() {
  $q.dialog({
    component: modalSelecionarCliente,
  }).onOk((data) => {
    state.nota.cliente.id = data.cliente_id;
    state.nota.cliente.nome = data.nome;
  });
}
</script>

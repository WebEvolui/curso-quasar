<template>
  <q-page padding>
    <div class="shadow-2">
      <q-form @submit="editarProduto">
        <q-card-section>
          <div class="text-h5">Editar produto</div>
        </q-card-section>

        <q-card-section class="q-py-md-sm">
          <div class="row">
            <div class="col-md-4 col-xs-12 q-pr-md-md">
              <q-input
                outlined
                autocomplete="off"
                v-model="state.nome"
                label="Nome"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
              />
            </div>

            <div class="col-md-4 col-xs-12 q-pr-md-md">
              <q-input outlined v-model="state.descricao" label="Descrição" />
            </div>

            <div class="col-md-4 col-xs-12">
              <q-select
                square
                outlined
                v-model="state.categoria_id"
                :options="arrayCategorias"
                label="Categoria"
                emit-value
                map-options
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-py-md-sm">
          <div class="row">
            <div class="col-md-4 col-xs-12 q-pr-md-md">
              <q-input
                outlined
                mask="#,##"
                fill-mask="#"
                reverse-fill-mask
                v-model="state.preco"
                label="Preço"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
              />
            </div>

            <div class="col-md-4 col-xs-12 q-pr-md-md">
              <q-input
                outlined
                type="number"
                v-model="state.estoque"
                label="Estoque"
                lazy-rules
                :rules="[
                  (val) => (val && val > 0) || 'Campo obrigatório',
                ]"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-px-md q-py-md">
          <q-btn label="Atualizar" type="submit" color="secondary" />
        </q-card-actions>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { moneyToDB, showMoney } from "src/helpers/money";

const $q = useQuasar();
const router = useRouter();

const arrayCategorias = ref([]);

const state = reactive({
  id: "",
  nome: "",
  descricao: "",
  categoria_id: "",
  preco: "",
  estoque: "",
});

onMounted(() => {
  $q.loading.show();

  if (router.currentRoute.value.params.id) {
    state.id = router.currentRoute.value.params.id.toString();
  } else {
    router.push({ path: "/produtos" });
  }

  getCategorias();
  getData();
});

async function getCategorias() {
  api
    .get("/categorias")
    .then(function (response) {
      arrayCategorias.value = response.data.map((item: any) => {
        return {
          label: item.nome,
          value: item.id,
        };
      });
    })
    .catch(function (error) {
      $q.notify({
        type: "negative",
        message: error.response.data.message,
      });
    });
}

async function getData() {
  api
    .get("/produtos/" + state.id)
    .then(function (response) {
      if (response.status === 200) {
        state.nome = response.data.nome;
        state.descricao = response.data.descricao;
        state.categoria_id = response.data.categoria_id;
        state.preco = showMoney(response.data.preco);
        state.estoque = response.data.estoque;
      }
    })
    .then(() => {
      $q.loading.hide();
    })
    .catch(function (error) {
      $q.notify({
        type: "negative",
        message: error.response.data.message,
      });

      $q.loading.hide();
    });
}

function editarProduto() {
  api
    .put(`/produtos/${state.id}`, {
      nome: state.nome,
      descricao: state.descricao,
      categoria_id: state.categoria_id,
      preco: moneyToDB(state.preco),
      estoque: state.estoque,
    })
    .then(function (response) {
      if (response.status === 200) {
        $q.notify({
          type: "positive",
          message: "Produto atualizado com sucesso",
        });

        router.push({ path: "/produtos" });
      }
    })
    .catch(function (error) {
      $q.notify({
        type: "negative",
        message: error.response.data.message,
      });
    });
}
</script>

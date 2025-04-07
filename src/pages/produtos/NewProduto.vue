div
<template>
  <q-page padding>
    <div class="shadow-2">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-h5">Cadastrar Produto</div>
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
                autocomplete="off"
                v-model="state.estoque"
                label="Estoque"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-px-md q-py-md">
          <q-btn label="Cadastrar" type="submit" color="primary" />
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
import { moneyToDB } from "src/helpers/money";

const $q = useQuasar();
const router = useRouter();
const state = reactive({
  nome: "",
  descricao: "",
  categoria_id: "",
  preco: "",
  estoque: "",
});

const arrayCategorias = ref([]);

onMounted(() => {
  getCategorias();
});

function getCategorias() {
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

function onSubmit() {
  api
    .post("/produtos", {
      nome: state.nome,
      descricao: state.descricao,
      categoria_id: state.categoria_id,
      preco: moneyToDB(state.preco),
      estoque: state.estoque,
    })
    .then(function (response) {
      if (response.status === 201) {
        $q.notify({
          type: "positive",
          message: "Produto cadastrado com sucesso",
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

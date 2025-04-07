<template>
  <q-page padding>
    <div class="shadow-2">
      <q-form @submit="onSubmit" @reset="onReset">
        <q-card-section>
          <div class="text-h5">Cadastrar Fornecedor</div>
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
              <q-input
                outlined
                autocomplete="off"
                v-model="state.cnpj"
                label="CNPJ"
                mask="##.###.###/####-##"
                lazy-rules
                :rules="[(val) => (val && val.length == 18) || 'CNPJ inválido']"
              />
            </div>

            <div class="col-md-4 col-xs-12">
              <q-input
                outlined
                autocomplete="off"
                v-model="state.telefone"
                mask="(##) #####-####"
                label="Celular"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-py-md-sm">
          <div class="row">
            <div class="col-md-4 col-xs-12 q-pr-md-md">
              <q-input
                outlined
                autocomplete="off"
                v-model="state.endereco"
                label="Endereço completo"
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
                type="email"
                v-model="state.email"
                label="E-mail"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
              />
            </div>

            <div class="col-md-4 col-xs-12">
              <q-input
                outlined
                v-model="state.contato"
                label="Nome do contato"
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
          <q-btn
            label="Cancelar"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const state = reactive({
  nome: "",
  cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
  contato: "",
});

function onSubmit() {
  const cnpj = state.cnpj.replace(/\D/g, "");

  api
    .post("/fornecedores", {
      nome: state.nome,
      cnpj: cnpj,
      endereco: state.endereco,
      telefone: state.telefone,
      email: state.email,
      contato: state.contato,
    })
    .then(function (response) {
      if (response.status === 201) {
        $q.notify({
          type: "positive",
          message: "Fornecedor cadastrado com sucesso",
        });

        router.push({ path: "/fornecedores" });
      }
    })
    .catch(function (error) {
      $q.notify({
        type: "negative",
        message: error.response.data.message,
      });
    });
}

function onReset() {
  state.nome = "";
  state.cnpj = "";
  state.endereco = "";
  state.telefone = "";
  state.email = "";
  state.contato = "";
}
</script>

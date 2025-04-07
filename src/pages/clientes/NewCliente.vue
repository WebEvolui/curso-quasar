<template>
  <q-page padding>
    <div class="shadow-2">
      <q-form @submit="onSubmit" @reset="onReset">
        <q-card-section>
          <div class="text-h5">Cadastrar Cliente</div>
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
                v-model="state.cpf_cnpj"
                label="CNPJ ou CPF"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Campo obrigatório',
                ]"
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
  cpf_cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
});

function onSubmit() {
  const cnpj = state.cpf_cnpj.replace(/\D/g, "");

  api
    .post("/clientes", {
      nome: state.nome,
      cpf_cnpj: cnpj,
      endereco: state.endereco,
      telefone: state.telefone,
      email: state.email,
    })
    .then(function (response) {
      if (response.status === 201) {
        $q.notify({
          type: "positive",
          message: "Cliente cadastrado com sucesso",
        });

        router.push({ path: "/clientes" });
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
  state.cpf_cnpj = "";
  state.endereco = "";
  state.telefone = "";
  state.email = "";
}
</script>

<template>
  <q-page padding>
    <div class="shadow-2">
      <q-form @submit="editarCliente">
        <q-card-section>
          <div class="text-h5">Editar Cliente</div>
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
          <q-btn label="Atualizar" type="submit" color="secondary" />
        </q-card-actions>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const state = reactive({
  id: "",
  nome: "",
  cpf_cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
});

onMounted(() => {
  $q.loading.show();

  if (router.currentRoute.value.params.id) {
    state.id = router.currentRoute.value.params.id.toString();

    try {
      if (state.id > 0) {
        state.id = parseInt(state.id);
      } else {
        throw new Error();
      }

      getData();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "ID inválido",
      });
      router.push({ path: "/clientes" });
    }
  } else {
    router.push({ path: "/clientes" });
  }
});

async function getData() {
  api
    .get("/clientes/" + state.id)
    .then(function (response) {
      if (response.status === 200) {
        state.nome = response.data.nome;
        state.cpf_cnpj = response.data.cpf_cnpj;
        state.endereco = response.data.endereco;
        state.telefone = response.data.telefone;
        state.email = response.data.email;
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

function editarCliente() {
  api
    .put(`/clientes/${state.id}`, {
      nome: state.nome,
      cpf_cnpj: state.cpf_cnpj.replace(/\D/g, ""),
      endereco: state.endereco,
      telefone: state.telefone,
      email: state.email,
    })
    .then(function (response) {
      if (response.status === 200) {
        $q.notify({
          type: "positive",
          message: "Cliente atualizado com sucesso",
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
</script>

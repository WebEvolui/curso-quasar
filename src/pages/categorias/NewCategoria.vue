<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form @submit="cadastrar">
        <q-card-section>
          <div class="text-h6">Cadastrar Categoria</div>
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            v-model="state.nome"
            label="Categoria"
            autofocus
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            v-model="state.descricao"
            label="Descrição"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="check" color="primary" type="submit" />
          <q-btn icon="close" color="negative" @click="onCancelClick" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive } from "vue";
import { useDialogPluginComponent } from "quasar";
import { api } from "boot/axios";

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const state = reactive({
      nome: "",
      descricao: "",
    });

    async function cadastrar() {
      api.post("/categorias", state).then((response) => {
        if (response.status == 201) {
          onDialogOK();
        }
      });
    }

    return {
      dialogRef,
      onDialogHide,
      cadastrar,
      onCancelClick: onDialogCancel,
      state,
    };
  },
};
</script>

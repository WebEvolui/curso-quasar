<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form @submit="editar">
        <q-card-section>
          <div class="text-h5">Editar Categoria</div>
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
  props: { payload: Object },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const state = reactive({
      id: props.payload.id,
      nome: props.payload.nome,
      descricao: props.payload.descricao,
    });

    async function editar() {
      api
        .put("/categorias/" + state.id, {
          nome: state.nome,
          descricao: state.descricao,
        })
        .then((response) => {
          if (response.status == 200) {
            onDialogOK();
          }
        });
    }

    return {
      dialogRef,
      onDialogHide,
      editar,
      onCancelClick: onDialogCancel,
      state,
    };
  },
};
</script>

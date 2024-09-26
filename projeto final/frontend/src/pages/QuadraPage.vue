<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/api';
import type { ApplicationError, Quadra } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';

const quadras = ref<Quadra[]>([]);
const exception = ref<ApplicationError | undefined>(undefined);
const loading = ref(true);
const success = ref(false);
const deleteRequested = ref(false);
const quadraToRemove = ref<Quadra | undefined>(undefined);

const userStore = useUserStore();

// Função para carregar as quadras
async function loadQuadras() {
  try {
    const res = await api.get('http://localhost:2222/quadras', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    });
    quadras.value = res.data.data;
  } catch (e) {
    exception.value = e as ApplicationError;
  } finally {
    loading.value = false;
  }
}

// Função para remover uma quadra
async function removeQuadra() {
  try {
    if (!quadraToRemove.value) return; // Verifica se quadraToRemove está definido
    await api.delete(`http://localhost:2222/quadras/${quadraToRemove.value.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    });
    const toRemove = quadras.value.findIndex(q => q.id === quadraToRemove.value.id);
    if (toRemove !== -1) {
      quadras.value.splice(toRemove, 1);
    }
    console.log('testeando remove')
    success.value = true;
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    toggleModal();
  }
}

// Função para solicitar a exclusão de uma quadra
function askToDelete(id: number) {
  const index = quadras.value.findIndex(q => q.id === id);
  quadraToRemove.value = quadras.value[index]; // Use quadraToRemove
  toggleModal();
}


// Função para alternar o estado do modal de confirmação
function toggleModal() {
  deleteRequested.value = !deleteRequested.value;
}

// Carrega as quadras ao iniciar o componente
loadQuadras(); 
</script>

<template>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception = undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
    A quadra foi removida com sucesso
    <button @click="success = false" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div>
    <RouterLink to="/quadras/new" class="btn btn-success">
      <i class="bi bi-plus-circle"></i> Novo
    </RouterLink>
  </div>

  <div v-if="loading" class="d-flex justify-content-center">
    <div class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <table v-else class="table table-striped">
    <thead>
      <tr>
        <th>Id</th>
        <th>Nome</th>
        <th>Modalidade</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quadra in quadras" :key="quadra.id">
        <td>{{ quadra.id }}</td>
        <td>{{ quadra.name }}</td>
        <td>{{ quadra.type }}</td>
        <td>
          <RouterLink class="btn btn-sm btn-info" :to="`/quadras/${quadra.id}`"><i class="bi bi-eye"></i></RouterLink>
          <button @click="askToDelete(quadra.id)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
        </td>
      </tr>

    </tbody>
  </table>

  <!-- Modal de confirmação de exclusão -->
  <div class="modal fade" tabindex="-1" :class="{ show: deleteRequested }" style="display: block;"
    v-if="deleteRequested">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remover quadra</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="toggleModal"></button>
        </div>
        <div class="modal-body">
          <p>A quadra de modalidade <strong>{{ quadraToRemove?.type }} de id {{ quadraToRemove?.id }}</strong> será
            removida. Você tem certeza que deseja realizar esta operação?</p>
        </div>
        <div class="modal-footer">
          <button @click="toggleModal" type="button" class="btn btn-secondary">Não</button>
          <button @click="removeQuadra" type="button" class="btn btn-danger">Sim</button>
        </div>
      </div>
    </div>
  </div>

</template>

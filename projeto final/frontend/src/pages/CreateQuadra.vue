<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { api } from '@/api'
import { isApplicationError } from '@/composables/useApplicationError'
import { useUserStore } from '@/stores/userStore'
import type { Quadra, ApplicationError } from '@/types'

// Definindo referências reativas para armazenar dados e estados
const quadra = ref({
  modalidade: '',
  name: ''
} as Quadra)
const exception = ref<ApplicationError>()
const loading = ref(false)
const created = ref(false)

const router = useRouter()
const userStore = useUserStore()

// Função para adicionar uma nova quadra
async function addQuadra() {
  try {
    loading.value = true
    const res = await api.post('http://localhost:2222/quadras', {
      name: quadra.value.name,
      type: quadra.value.modalidade
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    quadra.value = res.data.data
    created.value = true
    // Redireciona para a página de lista de quadras após criar
    router.push('/quadras')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h2 class="text-center mb-4">Criar Nova Quadra</h2>
  <div v-if="created" class="alert alert-success" role="alert">Quadra criada com sucesso!</div>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception = undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <form @submit.prevent="addQuadra">
    <div class="card">
      <h3 class="card-header text-center">Informações da Quadra</h3>
      <div class="card-body">
        <div class="mb-3">
          <label for="name" class="form-label">Nome da Quadra:</label>
          <input v-model="quadra.name" type="text" class="form-control" id="name" required />
        </div>
        <div class="mb-3">
          <label for="modalidade" class="form-label">Modalidade:</label>
          <input v-model="quadra.modalidade" type="text" class="form-control" id="modalidade" required />
        </div>
      </div>
      <div class="card-footer text-center">
        <input type="submit" class="btn btn-primary" value="Criar Quadra" :disabled="loading" />
      </div>
    </div>
  </form>
</template>

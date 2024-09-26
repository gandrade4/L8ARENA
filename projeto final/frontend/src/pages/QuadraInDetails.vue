<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { api } from '@/api'
import { isApplicationError } from '@/composables/useApplicationError'
import { useUserStore } from '@/stores/userStore'
import type { Quadra, ApplicationError } from '@/types'

// Definindo referências reativas para armazenar dados e estados
const quadra = ref({
  id: 0,
  modalidade: '',
  name: ''
} as Quadra)
const quadras = ref([] as Quadra[])
const exception = ref<ApplicationError>()
const loading = ref(true)
const updated = ref(false)
const id = ref<number | null>(null)
const searchModalidade = ref('')

const editionMode = ref(false)
const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

// Função para alternar o modo de edição
function toggleEdit() {
  editionMode.value = !editionMode.value
}

// Função para atualizar uma quadra existente
async function updateQuadra() {
  try {
    loading.value = true
    const res = await api.put(`http://localhost:2222/quadras/${quadra.value.id}`, {
      type: quadra.value.type, // Garante que estamos enviando o valor correto
      name: quadra.value.name // Se também há um campo de nome
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    quadra.value = res.data.data
    updated.value = true
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}


// Função para buscar uma quadra específica pelo ID
async function fetchQuadra(quadraId: number) {
  try {
    loading.value = true
    const res = await api.get(`http://localhost:2222/quadras/${quadraId}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    quadra.value = res.data.data
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

// Função para buscar quadras por modalidade
async function searchQuadras() {
  try {
    loading.value = true
    const res = await api.get(`http://localhost:2222/quadras?modalidade=${searchModalidade.value}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    quadras.value = res.data.data
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

// Função para editar a modalidade de uma quadra diretamente na lista
function editModalidade(quadraId: number, newModalidade: string) {
  const quadraToEdit = quadras.value.find(q => q.id === quadraId)
  if (quadraToEdit) {
    quadraToEdit.modalidade = newModalidade
  }
}

// Função executada quando o componente é montado
onMounted(() => {
  if (route.params.id) {
    id.value = Number(route.params.id)
    fetchQuadra(id.value)
  }
})
</script>

<template>
  <h2 class="text-center mb-4">Gerenciamento de Quadras</h2>
  <p></p>
  <div v-if="updated" class="alert alert-success" role="alert">Quadra atualizada com sucesso!</div>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception = undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <form v-else @submit.prevent="id ? updateQuadra() : addQuadra()">
    <div class="card">
      <h3 class="card-header text-center">Informações da Quadra</h3>
      <div class="card-body">
        <div class="mb-3">
          <a v-if="id" @click="toggleEdit" class="btn btn-outline-secondary btn-sm">
            <template v-if="editionMode">
              <i class="bi bi-lock"></i>
              Desabilitar edição
            </template>
            <template v-else>
              <i class="bi bi-unlock"></i>
              Habilitar edição
            </template>
          </a>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">Nome:</label>
          <input v-model="quadra.name" type="text" class="form-control" id="name" :disabled="!editionMode" />
          <label for="modalidade" class="form-label">Modalidade:</label>
          <input v-model="quadra.type" type="text" class="form-control" id="modalidade"
            :disabled="!editionMode" />
        </div>

      </div>
      <div class="card-footer text-center mt-3">
        <input v-if="editionMode && id" type="submit" class="btn btn-primary" value="Atualizar" />
        <input v-else-if="!id" type="submit" class="btn btn-secondary" value="Adicionar" />
      </div>
    </div>
  </form>

</template>

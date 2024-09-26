<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import type { ApplicationError } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { jwtDecode } from 'jwt-decode';

// Definição de variáveis reativas
const username = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()
const userStore = useUserStore()

// Função para autenticar o usuário
async function authenticate() {
  try {
    loading.value = true
    exception.value = undefined

    // Realiza a requisição de autenticação
    const { data } = await api.post('http://localhost:2222/login', {
      username: username.value,
      password: password.value
    })

    // Extrai o JWT e o usuário da resposta
    const { jwt, user } = data.data

    // Atualiza o estado de autenticação no store
    userStore.authenticate(user, jwt)

    // Decodifica o JWT
    if (jwt) {
      const decoded: any = jwtDecode(jwt); // Usando 'any' para evitar erros de tipo

      // Verifica se o campo 'role' existe
      const role = decoded.userRole;
      if (role === "admin") {
        router.push('/quadras')
      } else {
        router.push('/reservas')
      }
    }

    // Redireciona para a página de quadras
    
  } catch (e) {
    // Lida com erros da requisição
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

// Função para ir para a página de criação de usuário
function goToCreateUser() {
  router.push('/users/new')  // Altere para a rota de criação de usuário que você está usando
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Sign in</h5>

        <!-- Mostra erro, se houver -->
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.message }}
        </div>

        <!-- Formulário de login -->
        <form v-if="!loading" @submit.prevent="authenticate">
          <div class="mb-3">
            <label for="usernameInput" class="form-label">Nome de usuário:</label>
            <input v-model="username" type="text" class="form-control" id="usernameInput" placeholder="Digite seu nome de usuário" required>
            <div class="invalid-feedback">
              Você deve informar um nome de usuário.
            </div>
          </div>

          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input v-model="password" type="password" class="form-control" id="passwordInput" placeholder="Digite sua senha" required>
            <div class="invalid-feedback">
              A senha é um campo obrigatório.
            </div>
          </div>

          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Enviar" />
          </div>
        </form>

        <!-- Mensagem enquanto espera resposta -->
        <p v-else>
          Esperando resposta do servidor...
        </p>

        <!-- Botão para criar usuário -->
        <div class="mt-3 text-center">
          <button class="btn btn-secondary" @click="goToCreateUser" :disabled="loading">Criar usuário</button>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div>
    <!-- Mensagem de sucesso ao realizar a reserva -->
    <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
      A reserva foi realizada com sucesso!
      <button @click="success = false" type="button" class="btn-close" aria-label="Fechar"></button>
    </div>

    <!-- Loader enquanto os dados estão sendo carregados -->
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <!-- Seleção da quadra e exibição do calendário -->
    <div v-else>
      <div class="mb-3">
        <label for="quadra" class="form-label">Quadra</label>
        <select id="quadra" v-model="selectedQuadra" class="form-select" @change="checkAvailability">
          <option value="" disabled selected>Selecione uma quadra</option>
          <option v-for="quadra in quadras" :key="quadra.id" :value="quadra">
            {{ quadra.name }} - {{ quadra.type }}
          </option>
        </select>
      </div>

      <!-- Componente CalendarComponent para mostrar os horários disponíveis -->
      <CalendarComponent
        v-if="selectedQuadra"
        :quadraId="selectedQuadra.id"
        @reserve="reserveQuadra"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { api } from '@/api'; // Importa a API
import type { Quadra, ApplicationError } from '@/types'; // Tipos utilizados
import { useUserStore } from '@/stores/userStore'; // Armazenamento do usuário
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError'; // Função para tratar erros
import CalendarComponent from '@/components/CalendarComponent.vue'; // Importa o novo componente

// Variáveis reativas
const quadras = ref<Quadra[]>([]);
const selectedQuadra = ref<Quadra | null>(null);
const exception = ref<ApplicationError | null>(null);
const loading = ref(true);
const success = ref(false);

const userStore = useUserStore(); // Obtém o estado do usuário

// Função para carregar as quadras disponíveis
async function loadQuadras() {
  try {
    const res = await api.get('http://localhost:2222/quadras', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    });
    quadras.value = res.data.data; // Armazena as quadras
  } catch (e) {
    exception.value = e as ApplicationError; // Captura erros de aplicação
  } finally {
    loading.value = false; // Finaliza o carregamento
  }
}

// Função para verificar a disponibilidade da quadra selecionada
async function checkAvailability() {
  if (!selectedQuadra.value) return;
  try {
  const res = await api.get(`http://localhost:2222/quadras/${selectedQuadra.value.id}/disponibilidade`, {
    headers: {
      Authorization: `Bearer ${userStore.jwt}`
    }
  });
  availableHorarios.value = res.data.data.map((horario: string) => {
    const start = horario;
    const end = new Date(new Date(horario).getTime() + 60 * 60 * 1000).toISOString();
    return { title: 'Disponível', start, end };
  });
} catch (e) {
  exception.value = e as ApplicationError;
}
}

// Função para reservar a quadra
async function reserveQuadra(horarioSelecionado: string) {
  if (!selectedQuadra.value || !horarioSelecionado) return;

  try {
    await api.post('http://localhost:2222/reservas', {
      quadraId: selectedQuadra.value.id,
      modalidade: selectedQuadra.value.modalidade,
      horario: horarioSelecionado
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    });
    success.value = true; // Marca a reserva como bem-sucedida
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data; // Captura erros de aplicação
    } else {
      exception.value = { message: 'Erro ao reservar a quadra. Tente novamente.' }; // Mensagem de erro genérica
    }
  }
}

// Carrega as quadras ao montar o componente
onMounted(() => {
  loadQuadras();
});
</script>

<style scoped>
.spinner-grow {
  width: 3rem;
  height: 3rem;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/api';
import type { Quadra, ApplicationError } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import VueCal from 'vue-cal'; // Importa o Vue Cal

// Registre o VueCal como um componente
defineExpose({
  VueCal
});

const quadras = ref<Quadra[]>([]);
const selectedQuadra = ref<Quadra | null>(null);
const availableHorarios = ref<{ title: string, start: string, end: string }[]>([]);
const exception = ref<ApplicationError | null>(null);
const loading = ref(true);
const success = ref(false);

const userStore = useUserStore();

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
    success.value = true;
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    } else {
      exception.value = { message: 'Erro ao reservar a quadra. Tente novamente.' };
    }
  }
}

onMounted(() => {
  loadQuadras();
});
</script>

<template>
  <div>

    <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
      A reserva foi realizada com sucesso!
      <button @click="success = false" type="button" class="btn-close" aria-label="Fechar"></button>
    </div>

    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-3">
        <label for="quadra" class="form-label">Quadra</label>
        <select id="quadra" v-model="selectedQuadra" class="form-select" @change="checkAvailability">
          <option value="" disabled selected>Selecione uma quadra</option>
          <option v-for="quadra in quadras" :key="quadra.id" :value="quadra"> {{ quadra.name }} - {{ quadra.type }}</option>
        </select>
      </div>

      <!-- Componente Vue Cal -->
      <vue-cal
        v-if="availableHorarios.length > 0"
        :events="availableHorarios"
        style="height: 250px"
        @event-click="(event) => reserveQuadra(event.start)"
      />
    </div>
  </div>
</template>

<style scoped>
.spinner-grow {
  width: 3rem;
  height: 3rem;
}

.vue-cal {
  border: 1px solid #007bff; /* Borda do calendário */
  border-radius: 0.5rem; /* Cantos arredondados */
  padding: 1rem; /* Espaçamento interno */
}
</style>

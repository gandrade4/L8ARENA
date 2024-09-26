<template>
  <div>
    <h1>Gerenciar Reservas</h1>

    <!-- Botão para criar nova reserva -->
    <button @click="openCreateModal" class="btn btn-success">Criar Reserva</button>

    <!-- Exibir todas as reservas -->
    <h2>Reservas Existentes</h2>
    <ul>
      <li v-for="reserva in reservas" :key="reserva.id">
        Reserva ID: {{ reserva.id }} | Quadra: {{ reserva.quadra.nome }} | 
        Data: {{ reserva.reservaData }} | Início: {{ formatTime(reserva.startTime) }} | Término: {{ formatTime(reserva.endTime) }}
        <button @click="openEditModal(reserva)" class="btn btn-sm btn-info">Editar</button>
        <button @click="askToDelete(reserva.id)" class="btn btn-sm btn-danger">Deletar</button>
      </li>
    </ul>

    <!-- Modal para criar ou editar reserva -->
    <div class="modal" tabindex="-1" v-if="isModalOpen">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Editar Reserva' : 'Criar Reserva' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitReserva">
              <div>
                <label for="quadra">Selecione a Quadra:</label>
                <select v-model="reservaData.quadraId" id="quadra" required>
                  <option value="" disabled>Selecione uma quadra</option>
                  <option v-for="quadra in quadras" :key="quadra.id" :value="quadra.id">
                    {{ quadra.nome }}
                  </option>
                </select>
              </div>
              <div>
                <label for="reservaData">Data da Reserva:</label>
                <input v-model="reservaData.reservaData" id="reservaData" type="date" required />
              </div>
              <div>
                <label for="startTime">Hora de Início:</label>
                <select v-model="reservaData.startTime" id="startTime" required>
                  <option value="" disabled>Selecione o horário de início</option>
                  <option v-for="horario in horarios" :key="horario.startTime" :value="horario.startTime">
                    {{ formatTime(horario.startTime) }}
                  </option>
                </select>
              </div>
              <div>
                <label for="endTime">Hora de Término:</label>
                <select v-model="reservaData.endTime" id="endTime" required>
                  <option value="" disabled>Selecione o horário de término</option>
                  <option v-for="horario in horarios" :key="horario.endTime" :value="horario.endTime">
                    {{ formatTime(horario.endTime) }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Salvar Reserva</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmação de deleção -->
    <div class="modal" tabindex="-1" v-if="deleteRequested">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Remover Reserva</h5>
            <button type="button" class="btn-close" @click="deleteRequested = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Você tem certeza que deseja remover a reserva de ID <strong>{{ reservaToRemove.id }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteRequested = false">Não</button>
            <button type="button" class="btn btn-danger" @click="removeReserva(reservaToRemove.id)">Sim</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import type { ApplicationError, Reserva } from '@/types';

const reservaData = ref({
  quadraId: '',
  reservaData: '',
  startTime: '',
  endTime: '',
});
const reservas = ref<Reserva[]>([]);
const quadras = ref([]);
const horarios = ref([]);
const exception = ref<ApplicationError | null>(null);
const loading = ref(true);
const isModalOpen = ref(false);
const editMode = ref(false);
const deleteRequested = ref(false);
const reservaToRemove = ref<Reserva | null>(null);

const userStore = useUserStore();

async function fetchReservas() {
  try {
    const res = await axios.get('http://localhost:2222/reservas/', {
      headers: { Authorization: `Bearer ${userStore.jwt}` },
    });
    reservas.value = res.data.data;
  } catch (e) {
    handleError(e);
  }
}

async function fetchQuadras() {
  try {
    const res = await axios.get('http://localhost:2222/quadras/', {
      headers: { Authorization: `Bearer ${userStore.jwt}` },
    });
    quadras.value = res.data.data;
  } catch (e) {
    handleError(e);
  }
}

async function fetchHorarios() {
  try {
    const res = await axios.get('http://localhost:2222/quadras/:id/horarios', {
      headers: { Authorization: `Bearer ${userStore.jwt}` },
    });
    horarios.value = res.data.data;
  } catch (e) {
    handleError(e);
  }
}

async function submitReserva() {
  try {
    if (editMode.value) {
      await axios.put(`http://localhost:2222/reservas/${this.editReservaId}`, reservaData.value, {
        headers: { Authorization: `Bearer ${userStore.jwt}` },
      });
    } else {
      await axios.post(`http://localhost:2222/reservas/`, reservaData.value, {
        headers: { Authorization: `Bearer ${userStore.jwt}` },
      });
    }
    closeModal();
    await fetchReservas();
  } catch (e) {
    handleError(e);
  }
}

function openCreateModal() {
  editMode.value = false;
  reservaData.value = {
    quadraId: '',
    reservaData: '',
    startTime: '',
    endTime: '',
  };
  isModalOpen.value = true;
}

function openEditModal(reserva: Reserva) {
  editMode.value = true;
  reservaData.value = { ...reserva };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function askToDelete(id: number) {
  const reserva = reservas.value.find(r => r.id === id);
  reservaToRemove.value = reserva || null;
  deleteRequested.value = true;
}

async function removeReserva(id: number) {
  try {
    await axios.delete(`http://localhost:2222/reservas/${id}`, {
      headers: { Authorization: `Bearer ${userStore.jwt}` },
    });
    deleteRequested.value = false;
    await fetchReservas();
  } catch (e) {
    handleError(e);
  }
}

function handleError(e: any) {
  if (axios.isAxiosError(e)) {
    exception.value = e.response?.data as ApplicationError;
  } else {
    console.error('Unexpected error:', e);
  }
}

// Carregar dados iniciais
onMounted(() => {
  fetchReservas();
  fetchQuadras();
  fetchHorarios();
});
</script>

<style scoped>
.modal {
  display: block;
}

td > .btn {
  margin: 0 5px;
}
</style>

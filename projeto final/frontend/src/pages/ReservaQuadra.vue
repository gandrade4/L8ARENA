<template>
  <div>
    <h1>Gerenciar Reservas</h1>

    <!-- Formulário para criar ou atualizar uma reserva -->
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

      <button type="submit">Salvar Reserva</button>
    </form>

    <!-- Exibir todas as reservas -->
    <h2>Reservas Existentes</h2>
    <ul>
      <li v-for="reserva in reservas" :key="reserva.id">
        Reserva ID: {{ reserva.id }} | Quadra: {{ reserva.quadra.nome }} | 
        Data: {{ reserva.reservaData }} | Início: {{ formatTime(reserva.startTime) }} | Término: {{ formatTime(reserva.endTime) }}
        <button @click="editReserva(reserva)">Editar</button>
        <button @click="deleteReserva(reserva.id)">Deletar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reservaData: {
        quadraId: "",
        reservaData: "",
        startTime: "",
        endTime: "",
      },
      reservas: [],
      quadras: [], // Para armazenar as quadras disponíveis
      horarios: [], // Para armazenar os horários disponíveis
      editMode: false,
      editReservaId: null,
    };
  },
  methods: {
    // Função para buscar as quadras disponíveis
    async fetchQuadras() {
      try {
        const response = await axios.get("http://localhost:2222/quadras/");
        this.quadras = response.data;
      } catch (error) {
        console.error("Erro ao buscar quadras:", error);
      }
    },

    // Função para buscar os horários disponíveis
    async fetchHorarios() {
      try {
        const response = await axios.get("http://localhost:2222/quadras/:id/horarios");
        this.horarios = response.data;
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    },

    // Função para buscar todas as reservas
    async fetchReservas() {
      try {
        const response = await axios.get("http://localhost:2222/reservas/");
        this.reservas = response.data;
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    },

    // Função para criar ou atualizar uma reserva
    async submitReserva() {
      try {
        if (this.editMode) {
          await axios.put(`http://localhost:2222/reservas/${this.editReservaId}`, this.reservaData);
          this.editMode = false;
          this.editReservaId = null;
        } else {
          await axios.post("http://localhost:2222/reservas/", this.reservaData);
        }

        this.reservaData = {
          quadraId: "",
          reservaData: "",
          startTime: "",
          endTime: "",
        };

        this.fetchReservas();
      } catch (error) {
        console.error("Erro ao salvar reserva:", error);
      }
    },

    // Função para editar uma reserva
    editReserva(reserva) {
      this.editMode = true;
      this.editReservaId = reserva.id;
      this.reservaData = {
        quadraId: reserva.quadra.id,
        reservaData: reserva.reservaData.split("T")[0],
        startTime: reserva.startTime,
        endTime: reserva.endTime,
      };
    },

    // Função para deletar uma reserva
    async deleteReserva(id) {
      try {
        await axios.delete(`http://localhost:2222/reservas/${id}`);
        this.fetchReservas();
      } catch (error) {
        console.error("Erro ao deletar reserva:", error);
      }
    },

    // Função para formatar a hora
    formatTime(dateTime) {
      const date = new Date(dateTime);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
  },

  mounted() {
    this.fetchQuadras();
    this.fetchHorarios();
    this.fetchReservas();
  },
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
}
button {
  margin-left: 10px;
}
</style>

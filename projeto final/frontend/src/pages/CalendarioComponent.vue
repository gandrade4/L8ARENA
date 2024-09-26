<template>
    <div>
      <FullCalendar
        :plugins="calendarPlugins"
        :headerToolbar="headerToolbar"
        :events="events"
        :eventClick="handleEventClick"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    quadraId: {
      type: Number,
      required: true,
    },
  });
  
  const calendarPlugins = [dayGridPlugin];
  const headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay',
  };
  const events = ref([]);
  
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`http://localhost:2222/quadras/${props.quadraId}/schedule`);
      events.value = response.data.horarios.map(horario => ({
        title: 'Reservado',
        start: horario.startTime,
        end: horario.endTime,
      }));
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      alert('Não foi possível carregar os horários. Tente novamente mais tarde.');
    }
  };
  
  onMounted(fetchSchedules);
  
  const handleEventClick = (info) => {
    alert('Evento: ' + info.event.title);
  };
  
  </script>
  
  <style scoped>
  /* Adicione estilos personalizados, se necessário */
  </style>
  
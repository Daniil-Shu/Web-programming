<template>
  <div>
    <h1>Список сервисов</h1>

    <div v-if="!showAddServiceForm">
      <div>
        <label for="showService">Показать сервис в БД:</label>
        <select id="showService" v-model="selectedService">
          <option v-for="service in services" :value="service" :key="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>

      <div>
        <button @click="toggleAddServiceForm">Добавить сервис</button>
      </div>

      <div>
        <button @click="toggleUpdateServiceForm">Обновить сервис</button>
      </div>

      <div>
        <button @click="toggleDeleteServiceForm">Удалить сервис</button>
      </div>
    </div>

    <!-- Форма для добавления нового сервиса -->
    <div v-if="showAddServiceForm">
      <h2>Добавить новый сервис</h2>
      <p>Название: <input v-model="newService.name"></p>
      <p>Описание: <input v-model="newService.description"></p>
      <button @click="addService">Сохранить сервис</button>
    </div>

    <!-- Форма для удаления сервиса -->
    <div v-if="showDeleteServiceForm">
      <h2>Удалить сервис</h2>
      <p>Вы уверены, что хотите удалить сервис {{ selectedService.name }}?</p>
      <button @click="confirmDeleteService">Да, удалить</button>
    </div>

    <!-- Информация о выбранном сервисе -->
    <div v-if="selectedService && !showAddServiceForm">
      <div v-if="showUpdateServiceForm">
        <h2>Обновить информация о сервисе</h2>
        <p>Название: <input v-model="selectedService.name"></p>
        <p>Описание: <input v-model="selectedService.description"></p>
        <button @click="saveUpdatedService">Сохранить изменения</button>
      </div>
      <div v-else>
        <h2>Информация о сервисе</h2>
        <p>Название: <input v-model="selectedService.name"></p>
        <p>Описание: <input v-model="selectedService.description"></p>
      </div>
    </div>


  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      services: [],
      selectedService: null,
      newService: {
        name: '',
        description: ''
      },
      showAddServiceForm: false,
      showUpdateServiceForm: false,
      showDeleteServiceForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/services');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        const data = res.data;
        this.services = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddServiceForm: function() {
      this.showAddServiceForm = !this.showAddServiceForm;
      if (!this.showAddServiceForm) {
        this.newService = {
          name: ''
        };
      }
    },
    toggleUpdateServiceForm: function() {
      this.showUpdateServiceForm = !this.showUpdateServiceForm;
    },
    toggleDeleteServiceForm: function() {
      this.showDeleteServiceForm = !this.showDeleteServiceForm;
    },
    addService: async function() {
      if (!this.newService.name) {
        console.log('Введите название и описание');
        return;
      }
      try {
        const res = await axios.post(this.host + '/service', this.newService);
        this.services.push(res.data);
        this.toggleAddServiceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedService: async function() {
      const updatedService = {
        id: this.selectedService.id,
        name: this.selectedService.name,
        description: this.selectedService.description
      };
      try {
        const res = await axios.put(this.host + '/service/' + updatedService.id, updatedService);
        const index = this.services.findIndex(service => service.id === res.data.id);
        this.services.splice(index, 1, res.data);
        this.toggleUpdateServiceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteService: async function() {
      try {
        const res = await axios.delete(this.host + '/service/' + this.selectedService.id);
        const index = this.services.findIndex(service => service.id === res.data.id);
        this.services.splice(index, 1);
        this.toggleDeleteServiceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>

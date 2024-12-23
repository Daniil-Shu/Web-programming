<template>
  <div>
    <h1>Список тарифов</h1>

    <div v-if="!showAddTariffForm">
      <div>
        <label for="showTariff">Показать тариф в БД:</label>
        <select id="showTariff" v-model="selectedTariff">
          <option v-for="tariff in tariffs" :value="tariff" :key="tariff.id">
            {{ tariff.name }}
          </option>
        </select>
      </div>

      <div>
        <button @click="toggleAddTariffForm">Добавить тариф</button>
      </div>

      <div>
        <button @click="toggleUpdateTariffForm">Обновить тариф</button>
      </div>

      <div>
        <button @click="toggleDeleteTariffForm">Удалить тариф</button>
      </div>
    </div>

    <!-- Форма для добавления нового тарифа -->
    <div v-if="showAddTariffForm">
      <h2>Добавить новый тариф</h2>
      <p>Название: <input v-model="newTariff.name"></p>
      <p>Описание: <input v-model="newTariff.description"></p>
      <p>Id сервиса: <input v-model="newTariff.services_id"></p>
      <p>Id устройства: <input v-model="newTariff.device_id"></p>
      <p>Цена: <input v-model="newTariff.price"></p>
      <button @click="addTariff">Сохранить тариф</button>
    </div>

    <!-- Форма для удаления тарифа -->
    <div v-if="showDeleteTariffForm">
      <h2>Удалить тариф</h2>
      <p>Вы уверены, что хотите удалить тариф {{ selectedTariff.name }}?</p>
      <button @click="confirmDeleteTariff">Да, удалить</button>
    </div>

    <!-- Информация о выбранном тарифе -->
    <div v-if="selectedTariff && !showAddTariffForm">
      <div v-if="showUpdateTariffForm">
        <h2>Обновить информацию о тарифе</h2>
        <p>Название: <input v-model="selectedTariff.name"></p>
        <p>Описание: <input v-model="selectedTariff.description"></p>
        <p>Id сервиса: <input v-model="selectedTariff.services_id"></p>
        <p>Id устройства: <input v-model="selectedTariff.device_id"></p>
        <p>Цена: <input v-model="selectedTariff.price"></p>
        <button @click="saveUpdatedTariff">Сохранить изменения</button>
      </div>
      <div v-else>
        <h2>Информация о тарифе</h2>
        <p>Название: <input v-model="selectedTariff.name"></p>
        <p>Описание: <input v-model="selectedTariff.description"></p>
        <p>Id сервиса: <input v-model="selectedTariff.services_id"></p>
        <p>Id устройства: <input v-model="selectedTariff.device_id"></p>
        <p>Цена: <input v-model="selectedTariff.price"></p>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tariffs: [],
      selectedTariff: null,
      newTariff: {
        name: '',
        description: '',
        services_id: '',
        device_id: '',
        price: ''
      },
      showAddTariffForm: false,
      showUpdateTariffForm: false,
      showDeleteTariffForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/tariffs');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        const data = res.data;
        this.tariffs = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddTariffForm: function() {
      this.showAddTariffForm = !this.showAddTariffForm;
      if (!this.showAddTariffForm) {
        this.newTariff = {
          name: '',
          description: '',
          services_id: '',
          device_id: '',
          price: ''
        };
      }
    },
    toggleUpdateTariffForm: function() {
      this.showUpdateTariffForm = !this.showUpdateTariffForm;
    },
    toggleDeleteTariffForm: function() {
      this.showDeleteTariffForm = !this.showDeleteTariffForm;
    },
    addTariff: async function() {
      if (!this.newTariff.name || !this.newTariff.description || !this.newTariff.services_id || !this.newTariff.services_id || !this.newTariff.price) {
        console.log('Введите нзвание, описания, id сервсиа, id тарифа и цену');
        return;
      }
      try {
        const res = await axios.post(this.host + '/tariff', this.newTariff);
        this.tariffs.push(res.data);
        this.toggleAddTariffForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedTariff: async function() {
      const updatedTariff = {
        id: this.selectedTariff.id,
        name: this.selectedTariff.name,
        description: this.selectedTariff.description,
        services_id: this.selectedTariff.services_id,
        device_id: this.selectedTariff.device_id,
        price: this.selectedTariff.price
      };
      try {
        const res = await axios.put(this.host + '/tariff/' + updatedTariff.id, updatedTariff);
        const index = this.tariffs.findIndex(tariff => tariff.id === res.data.id);
        this.tariffs.splice(index, 1, res.data);
        this.toggleUpdateTariffForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteTariff: async function() {
      try {
        const res = await axios.delete(this.host + '/tariff/' + this.selectedTariff.id);
        const index = this.tariffs.findIndex(tariff => tariff.id === res.data.id);
        this.tariffs.splice(index, 1);
        this.toggleDeleteTariffForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>

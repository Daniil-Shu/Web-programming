<template>
  <div>
    <h1>Список покупателей</h1>

    <div v-if="!showAddCustomerForm">
      <div>
        <label for="showCustomer">Показать покупателя в БД:</label>
        <select id="showCustomer" v-model="selectedCustomer">
          <option v-for="customer in customers" :value="customer" :key="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </div>

      <div>
        <button @click="toggleAddCustomerForm">Добавить покупателя</button>
      </div>

      <div>
        <button @click="toggleUpdateCustomerForm">Обновить покупателя</button>
      </div>

      <div>
        <button @click="toggleDeleteCustomerForm">Удалить покупателя</button>
      </div>
    </div>

    <!-- Форма для добавления нового покупателя -->
    <div v-if="showAddCustomerForm">
      <h2>Добавить нового покупателя</h2>
      <p>Имя: <input v-model="newCustomer.name"></p>
      <p>Фамилия: <input v-model="newCustomer.surname"></p>
      <p>Электронная почта: <input v-model="newCustomer.email"></p>
      <p>Id тарифа: <input v-model="newCustomer.tariff_id"></p>
      <button @click="addCustomer">Сохранить покупателя</button>
    </div>

    <!-- Форма для удаления покупателя -->
    <div v-if="showDeleteCustomerForm">
      <h2>Удалить покупателя</h2>
      <p>Вы уверены, что хотите удалить покупателя {{ selectedCustomer.name }}?</p>
      <button @click="confirmDeleteCustomer">Да, удалить</button>
    </div>

    <!-- Информация о выбранном покупателя -->
    <div v-if="selectedCustomer && !showAddCustomerForm">
      <div v-if="showUpdateCustomerForm">
        <h2>Обновить информацию о покупателя</h2>
        <p>Имя: <input v-model="selectedCustomer.name"></p>
        <p>Фамилия: <input v-model="selectedCustomer.surname"></p>
        <p>Электронная почта: <input v-model="selectedCustomer.email"></p>
        <p>Id тарифа: <input v-model="selectedCustomer.tariff_id"></p>
        <button @click="saveUpdatedCustomer">Сохранить изменения</button>
      </div>
      <div v-else>
        <h2>Информация о покупателе</h2>
        <p>Имя: <input v-model="selectedCustomer.name"></p>
        <p>Фамилия: <input v-model="selectedCustomer.surname"></p>
        <p>Электронная почта: <input v-model="selectedCustomer.email"></p>
        <p>Id тарифа: <input v-model="selectedCustomer.tariff_id"></p>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      customers: [],
      selectedCustomer: null,
      newCustomer: {
        name: '',
        surname: '',
        email: '',
        tariff_id: ''
      },
      showAddCustomerForm: false,
      showUpdateCustomerForm: false,
      showDeleteCustomerForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/customers');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        const data = res.data;
        this.customers = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddCustomerForm: function() {
      this.showAddCustomerForm = !this.showAddCustomerForm;
      if (!this.showAddCustomerForm) {
        this.newCustomer = {
          name: '',
          surname: '',
          email: '',
          tariff_id: ''
        };
      }
    },
    toggleUpdateCustomerForm: function() {
      this.showUpdateCustomerForm = !this.showUpdateCustomerForm;
    },
    toggleDeleteCustomerForm: function() {
      this.showDeleteCustomerForm = !this.showDeleteCustomerForm;
    },
    addCustomer: async function() {
      if (!this.newCustomer.name || !this.newCustomer.surname || !this.newCustomer.email || !this.newCustomer.tariff_id) {
        console.log('Введите имя, фамилию, электронную почту и id тарифа');
        return;
      }
      try {
        const res = await axios.post(this.host + '/customer', this.newCustomer);
        this.customers.push(res.data);
        this.toggleAddCustomerForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedCustomer: async function() {
      const updatedCustomer = {
        id: this.selectedCustomer.id,
        name: this.selectedCustomer.name,
        surname: this.selectedCustomer.surname,
        email: this.selectedCustomer.email,
        tariff_id: this.selectedCustomer.tariff_id
      };
      try {
        const res = await axios.put(this.host + '/customer/' + updatedCustomer.id, updatedCustomer);
        const index = this.customers.findIndex(customer => customer.id === res.data.id);
        this.customers.splice(index, 1, res.data);
        this.toggleUpdateCustomerForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteCustomer: async function() {
      try {
        const res = await axios.delete(this.host + '/customer/' + this.selectedCustomer.id);
        const index = this.customers.findIndex(customer => customer.id === res.data.id);
        this.customers.splice(index, 1);
        this.toggleDeleteCustomerForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>

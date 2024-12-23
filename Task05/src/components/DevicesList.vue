<template>
  <div>
    <h1>Список устройств</h1>

    <div v-if="!showAddDeviceForm">
      <div>
        <label for="showDevice">Показать устройство в БД:</label>
        <select id="showDevice" v-model="selectedDevice">
          <option v-for="device in devices" :value="device" :key="device.id">
            {{ device.name }}
          </option>
        </select>
      </div>

      <div>
        <button @click="toggleAddDeviceForm">Добавить устройство</button>
      </div>

      <div>
        <button @click="toggleUpdateDeviceForm">Обновить устройство</button>
      </div>

      <div>
        <button @click="toggleDeleteDeviceForm">Удалить устройство</button>
      </div>
    </div>

    <!-- Форма для добавления нового устройства -->
    <div v-if="showAddDeviceForm">
      <h2>Добавить новое устройство</h2>
      <p>Название: <input v-model="newDevice.name"></p>
      <button @click="addDevice">Сохранить устройство</button>
    </div>

    <!-- Форма для удаления устройства -->
    <div v-if="showDeleteDeviceForm">
      <h2>Удалить устройство</h2>
      <p>Вы уверены, что хотите удалить устройство {{ selectedDevice.name }}?</p>
      <button @click="confirmDeleteDevice">Да, удалить</button>
    </div>

    <!-- Информация о выбранном устройстве -->
    <div v-if="selectedDevice && !showAddDeviceForm">
      <div v-if="showUpdateDeviceForm">
        <h2>Обновить информацию об устройстве</h2>
        <p>Название: <input v-model="selectedDevice.name"></p>
        <button @click="saveUpdatedDevice">Сохранить изменения</button>
      </div>
      <div v-else>
        <h2>Информация об устройстве</h2>
        <p>Название: <input v-model="selectedDevice.name"></p>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      devices: [],
      selectedDevice: null,
      newDevice: {
        name: ''
      },
      showAddDeviceForm: false,
      showUpdateDeviceForm: false,
      showDeleteDeviceForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/devices');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        const data = res.data;
        this.devices = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddDeviceForm: function() {
      this.showAddDeviceForm = !this.showAddDeviceForm;
      if (!this.showAddDeviceForm) {
        this.newDevice = {
          name: ''
        };
      }
    },
    toggleUpdateDeviceForm: function() {
      this.showUpdateDeviceForm = !this.showUpdateDeviceForm;
    },
    toggleDeleteDeviceForm: function() {
      this.showDeleteDeviceForm = !this.showDeleteDeviceForm;
    },
    addDevice: async function() {
      if (!this.newDevice.name) {
        console.log('Введите название и описание');
        return;
      }
      try {
        const res = await axios.post(this.host + '/device', this.newDevice);
        this.devices.push(res.data);
        this.toggleAddDeviceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedDevice: async function() {
      const updatedDevice = {
        id: this.selectedDevice.id,
        name: this.selectedDevice.name
      };
      try {
        const res = await axios.put(this.host + '/device/' + updatedDevice.id, updatedDevice);
        const index = this.devices.findIndex(device => device.id === res.data.id);
        this.devices.splice(index, 1, res.data);
        this.toggleUpdateDeviceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteDevice: async function() {
      try {
        const res = await axios.delete(this.host + '/device/' + this.selectedDevice.id);
        const index = this.devices.findIndex(device => device.id === res.data.id);
        this.devices.splice(index, 1);
        this.toggleDeleteDeviceForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>

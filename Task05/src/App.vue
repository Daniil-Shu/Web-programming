<script setup>
import CustomersList from "@/components/CustomersList.vue";
import TariffsList from "@/components/TariffsList.vue";
import SerivcesList from "@/components/SerivcesList.vue";
import DevicesList from "@/components/DevicesList.vue";
import { ref } from "vue";

const selectedModel = ref('customer');
</script>

<template>
  <main style="width: 80vw" class="centered">
    <header style="justify-self: center; padding: 0">
      <img alt="Vue logo" src="./assets/logo.svg" width="125" height="125" />
    </header>

    <div style="width: fit-content" class="centered">
      <select v-model="selectedModel">
        <option value="customer">Покупатели</option>
        <option value="tariff">Тарифы</option>
        <option value="service">Сервисы</option>
        <option value="device">Устройста</option>
      </select>
      <CustomersList v-if="selectedModel === 'customer'" />
      <TariffsList v-if="selectedModel === 'tariff'" />
      <SerivcesList v-if="selectedModel === 'service'"/>
      <DevicesList v-if="selectedModel === 'device'" />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}


.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>

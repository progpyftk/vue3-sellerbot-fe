<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" color="#f0f0f0" app>

      <v-list-item v-for="item in items" :key="item.title" :to="item.router_name" link>
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>

    </v-navigation-drawer>

    <v-app-bar class="title" color="#f0f0f0" rounded app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        SellerBot v1.0.0 <v-icon icon="mdi-home" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      User: {{ $store.state.currentUser }}
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  data() {
    return {
      drawer: null,
      selectedItem: null,
      items: [
        { title: "Login", icon: "mdi-login", router_name: "/login" },
        { title: "Contas", icon: "mdi-playlist-edit", router_name: "/accounts" },
        { title: "Frete Grátis", icon: "mdi-truck-fast", router_name: "/free-shipping" },
        { title: "Full Sem Estoque", icon: "mdi-package-variant", router_name: "/no-stock-fulfillment" },
      ],
    };
  },
});
</script>

<style>
#inspire {
  background-color: var(--v-background-base);
}
</style>

<template>
  <div>
    <div height="400px" v-if="loadingtable == true">
      <v-flex>
        <v-card class="d-flex align-center justify-center" height="400px">
          <v-progress-circular
            :size="50"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card>
      </v-flex>
    </div>

    <v-card class="pa-8" outlined tile v-else>
      <v-data-table
        :headers="headers"
        :items="anuncios"
        item-key="ml_item_id"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flar>
            <v-toolbar-title>Anúncios no Full Sem Estoque</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.permalink="{ item }">
          <v-icon large dense color="orange darken-2" class="mr-2" @click="linkAnuncio(item)">mdi-arrow-right-bold</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
  
  <script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable vue/no-unused-vars */
/* eslint-disable vue/valid-v-slot */
import axios from "axios";

export default {
  name: "nostockfulfillment",
  data() {
    return {
      headers: [
        {
          text: "Anúncio",
          align: "start",
          sortable: false,
          value: "ml_item_id",
        },
        { text: "Título", value: "title" },
        { text: "Inventory ID", value: "inventory_id" },
        { text: "Qtt Disponível", value: "available_quantity" },
        { text: "Vendidos", value: "sold_quantity" },
        { text: "Logística", value: "logistic_type", sortable: false },
        { text: "Seller", value: "seller_id", sortable: false },
        { text: "Link do Full", value: "permalink", sortable: false },
      ],
      anuncios: [],
      editedIndex: -1,
      loadingtable: false,
    };
  },

  created() {
    this.getAnuncios();
  },

  methods: {
    getAnuncios() {
      this.loadingtable = true;
      axios
        .get( import.meta.env.VITE_BACKEND_URL + "/fulfillment/index", 
        { 
            headers: { Authorization: this.$store.state.authToken } 
        })
        .then((res) => {
          this.anuncios = res.data;
          console.log(res.data);
          this.loadingtable = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.request.status === 401) {
            console.log("--- user não está logado ---:");
            this.$router.push('login')
          }
          this.loadingtable = false;
        });
    },

    linkAnuncio(item) {
      this.editedIndex = this.anuncios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem.ml_item_id);
      window.open(
        "https://www.mercadolivre.com.br/anuncios/lista/fulfillment?page=1&search="+this.editedItem.ml_item_id
      );

    },
  },
};
</script>
<template>
    <div>
      <div height="400px" v-if="loadingtable == true">
        <v-flex>
          <v-card class="d-flex align-center justify-center" height="400px">
            <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
          </v-card>
        </v-flex>
      </div>
  
      <v-card class="pa-8" outlined tile v-else>
        <v-data-table :headers="headers" :items="anuncios" item-key="item_id" class="elevation-1" must-sort>
          <template v-slot:top>
            <v-toolbar flar>
              <v-toolbar-title>Anúncios com Erro de Frete Grátis
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.change_time="{ item }">
            {{ formatDate(item.change_time) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon v-if="updatingshipping == false" small @click="changeShipping(item)">
              mdi-truck-fast
            </v-icon>
            <v-progress-circular v-else :size="15" indeterminate color="primary"></v-progress-circular>
          </template>
          <template v-slot:item.permalink="{ item }">
            <v-icon large dense color="orange darken-2" class="mr-2"
              @click="linkAnuncio(item)">mdi-arrow-right-bold</v-icon>
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
  import moment from "moment";
  
  export default {
    name: "freeshipping",
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
          { text: "Seller", value: "seller_id" },
          { text: "Preço", value: "price" },
          { text: "Link", value: "permalink", sortable: false },
          { text: "Logística", value: "logistic_type", sortable: false },
          { text: "Actions", value: "actions", sortable: false },
        ],
        anuncios: [],
        loadingtable: false,
        updatingshipping: false,
      };
    },
  
    created() {
      this.getAnuncios();
    },
  
    methods: {
      getAnuncios() {
        this.loadingtable = true;
        axios
          .get( import.meta.env.VITE_BACKEND_URL + "/item/free-shipping", 
          { 
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json', Authorization: this.$store.state.authToken
              } 
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
      formatDate(item) {
        console.log(item);
        return moment(item).format("DD/MM/YY");
      },
      linkAnuncio(item) {
        window.open(item.permalink);
      },
      changeShipping(item) {
        this.updatingshipping = true;
        this.editedItem = Object.assign({}, item);
        console.log(this.editedItem.ml_item_id);
        console.log(this.editedItem.seller_id);
        axios
          .post( import.meta.env.VITE_BACKEND_URL + "/item/free-shipping", 
          {item: { ml_item_id: this.editedItem.ml_item_id, seller_id:this.editedItem.seller_id  }},
          { headers: { Authorization: this.$store.state.authToken } }
          )
          .then((res) => {
            console.log("foi tudo bem");
            console.log(res);
          })
          .catch((error) => {
            console.log("deu erro na alteracao do frete gratis");
            console.log(error);
            if (error.request.status === 401) {
              console.log("--- user não está logado ---:");
              this.$router.push('login')
            }
          })
          .finally(() => {
            this.getAnuncios();
            this.updatingshipping = false;
          });
      },
    },
  };
  </script>
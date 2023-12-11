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
      <v-data-table :headers="headers" :items="items" class="elevation-1" :sort-by="['seller']" must-sort
        @click:row="handleRowClick">
        <template v-slot:top>
          <v-toolbar flar>
            <v-toolbar-title>Controle de Promoções</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-dialog v-model="dialog" persistent :max-width="loading_promotion ? 'auto' : '600px'" class="mx-auto my-20">
            <v-card flat v-if="!loading_promotion">
              <!-- Dados da Promoção -->
              <v-divider class="mx-4"></v-divider>
              <v-card-title class="justify-center text-h5">{{ selectedItem.name }}</v-card-title>
              <v-divider class="mx-4"></v-divider>
              <br>
              <v-card-text class="text-h6">
                Tipo: {{ selectedItem.type }}<br><br>
                Seller: {{ selectedItem.seller }}<br><br>
                Status: {{ selectedItem.status }}<br><br>
                <div v-if="anuncios_aptos < 200">Anúncios Aptos: {{ anuncios_aptos }}<br><br></div>
                <div v-else>Anúncios Aptos: +200<br><br></div>

              </v-card-text>

              <v-divider class="mx-4"></v-divider>
              <v-card-title>Ativação de Anúncios</v-card-title>
              <v-col cols="12" md="4">
                <v-text-field v-model="markup" label="Markup Desejado" required hide-details type="number" min="0"
                  hint="Apenas os anúncios que atenderem serão ativados"
                  prepend-inner-icon="mdi-percent-box"></v-text-field>
              </v-col>
              <v-card-actions>

                <v-btn color="deep-purple lighten-2" :disabled="isProcessingPromotions" text @click="ativarPromocao">
                  Ativar todos
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Fechar</v-btn>
              </v-card-actions>
            </v-card>
            <!-- Spinner que será exibido quando estiver carregando -->
            <div v-else class="d-flex justify-center align-center" style="height: 200px;">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>
          </v-dialog>

          <!-- Diálogo de Processamento -->
          <v-dialog v-model="processingDialog" persistent max-width="300px">
            <v-card>
              <v-card-title class="headline">Processamento em Andamento</v-card-title>
              <v-card-text>Um conjunto de promoções está sendo ativado. Por favor, aguarde a conclusão.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="processingDialog = false">Fechar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </template>

        <template v-slot:item.benefits="{ item }">
          <p>MercadoLivre: {{ item.benefits ? item.benefits.meli_percent : '' }}%</p>
          <p>Seller: {{ item.benefits ? item.benefits.seller_percent : '' }}%</p>
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
  name: "deals",
  data() {
    return {
      headers: [
        { text: "Seller", align: "start", sortable: false, value: "seller" },
        { text: "ID Promoção", value: "promotion_id" },
        { text: "Type", value: "type" },
        { text: "Status", value: "status" },
        { text: "Start Date", value: "start_date" },
        { text: "Finish Date", value: "finish_date" },
        { text: "Deadline", value: "deadline_date" },
        { text: "Name", value: "name" },
        { text: "Benefits", value: "benefits" },
      ],
      items: [],
      loadingtable: false,
      selectedItem: { seller: "", promotion_id: "", type: "", status: "", start_date: "", finish_date: "", deadline_date: "", name: "", benefits: "" },
      dialog: false,
      markup: 5,
      anuncios_aptos: 0,
      isSubscribed: false,
      currentChannelKey: null,
      subscription: null,
      processingDialog: false,
      loading_promotion: false,
    };
  },

  created() {
    this.$store.dispatch('createCable'); // Isso vai inicializar a conexão Action Cable
    this.getItems();
    console.log("this.isProcessingPromotions()")
    console.log(this.$store.state.isProcessingPromotions)
  },

  computed: {
    isProcessingPromotions() {
      return this.$store.state.isProcessingPromotions;
    },
  },

  methods: {
    handleRowClick(click, row) {
      console.log("Cliquei na linha!")
      console.log(click)
      console.log(row)
      console.log(row.item.seller)
      console.log(row.item.promotion_id)
      console.log(row.item.type)
      if (this.isProcessingPromotions) {
        // Se as promoções estiverem sendo processadas, mostre o diálogo de processamento.
        this.processingDialog = true;
      } else {
        this.loadingtable = true;
        // Se as promoções não estiverem sendo processadas, abra o diálogo de promoção.
        this.abrirPromocao(row);
      }
    },

    abrirPromocao(row) {
      this.selectedItem = row.item
      // pegar os dados da promoção no ML via API, tais como número de anuncios
      axios
        .post( import.meta.env.VITE_BACKEND_URL + "/seller/promotion-data",
          {
            promotion_data: {
              promotion_id: this.selectedItem.promotion_id,
              type: this.selectedItem.type,
              seller: this.selectedItem.seller,
            }
          },
          { headers: { Authorization: this.$store.state.authToken } }
        )
        .then((res) => {
          // aqui é onde vamos pegar os dados da quantidade de anuncios apto e tal
          this.anuncios_aptos = res.data.total_items
        })
        .catch((error) => {
          console.log(error);
          if (error.request.status === 401) {
            console.log("--- user não está logado ---:");
            this.$router.push('login')
          }
        })
        .finally(() => {
          this.loadingtable = false;
          this.dialog = true;
        });
    },

    close() {
      // altereii um pouco pra ver o que acontece
      this.dialog = false;
    },

    getItems() {
      this.loadingtable = true;
      axios
        .get( import.meta.env.VITE_BACKEND_URL + "/seller/promotions", { headers: { Authorization: this.$store.state.authToken } })
        .then((res) => {
          this.items = res.data;
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

      axios
        .get( import.meta.env.VITE_BACKEND_URL + "/seller/promotions-status", { headers: { Authorization: this.$store.state.authToken } })
        .then((res) => {
          console.log('Pegando via axios se existe alguma promocao sendo processada')
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("Atualiza o status do processamente - falta colocar issno codigo")
        });
    },

    ativarPromocao() {
      this.loading_promotion = true;
      // Acessa o consumidor do Action Cable do estado Vuex
      const cable = this.$store.state.cable;

      console.log('Cable instance from Vuex:', cable);

      if (!cable) {
        console.error('Action Cable consumer instance is not available.');
        return;
      }

      if (this.subscription) {
        console.log('Limpando subscription 1 se houver')
        this.subscription.unsubscribe();
      }

      // A chave única para identificar a subscrição
      const channelKey = `${this.selectedItem.promotion_id}_${this.selectedItem.seller}`;
      console.log(channelKey)

      // Subscreve ao canal no Action Cable usando a chave única
      this.subscription = cable.subscriptions.create(
        { channel: "PromotionNotificationChannel", channel_key: channelKey },
        {
          received: (data) => {
            console.log('Received data:', data);
            // Lida com os dados recebidos
            if (data.status === 'processing_promotions') {
              this.$store.dispatch('setProcessingPromotions', true);
            }
            if (data.status === 'completed') {
              this.$store.dispatch('setProcessingPromotions', false);
              console.log('Dispatched to setProcessingPromotions with false');
              if (this.subscription) {
                this.subscription.unsubscribe();
              }
            }
          }
        }
      );

      console.log(this.selectedItem.name)
      console.log(this.markup)
      axios
        .post( import.meta.env.VITE_BACKEND_URL + "/seller/activate-promotion",
          {
            promotion_data: {
              promotion_id: this.selectedItem.promotion_id,
              type: this.selectedItem.type,
              seller: this.selectedItem.seller,
            }
          },
          { headers: { Authorization: this.$store.state.authToken } }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log("Deu erro, log do erro abaixo:");
          console.log(error);
          if (error.request.status === 401) {
            console.log("--- user não está logado ---:");
            this.$router.push('login')
          }
        })
        .finally(() => {
          this.dialog = false;
          this.loading_promotion = false;
        });
    },


    itemRowBackground(item) {
      console.log('Entre na funcao da cor')
      if (item.store_quantity < 10 && item.flex == true) {
        return "style-1";
      }
      if (item.store_quantity > 20 && item.flex == true) {
        return "style-2";
      }
      if (item.store_quantity < 20 && item.store_quantity > 10 && item.flex == true) {
        return "style-3";
      }
      if (item.store_quantity < 20 && item.store_quantity > 10 && item.flex == false) {
        return "style-1";
      }
      if (item.store_quantity > 20 && item.flex == false) {
        return "style-1";
      }
      if (item.store_quantity < 10 && item.flex == false) {
        return "style-2";
      }
    }
  },
};

</script>
  
<style>
.style-1 {
  background-color: rgb(240, 207, 204);
}

.style-2 {
  background-color: rgb(211, 249, 230);
}

.style-3 {
  background-color: rgb(244, 245, 218);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fundo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  /* Certifique-se de que é alto o suficiente para estar acima de outros elementos */
}
</style>
  
  
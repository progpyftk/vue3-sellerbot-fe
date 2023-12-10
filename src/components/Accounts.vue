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
        <v-data-table :headers="headers" :items="accounts" item-key="ml_seller_id" class="elevation-1">
          <template v-slot:top>
            <v-toolbar rounded elevation="1">
              <v-toolbar-title>MercadoLivre - Contas on Seller Bot</v-toolbar-title>
              <v-divider class="mx-4" insert vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                    Add Account
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.nickname" label="Account Name"></v-text-field>
                          <v-text-field v-if="editedIndex == -1" v-model="editedItem.ml_seller_id"
                            label="Seller ID"></v-text-field>
                          <v-text-field v-else v-model="editedItem.ml_seller_id" label="Seller ID - Not editable"
                            readonly></v-text-field>
                          <v-text-field v-model="editedItem.code" label="Code"></v-text-field>
                          <v-text-field v-if="editedIndex > -1" v-model="editedItem.access_token"
                            label="Acess Token"></v-text-field>
  
                          <v-text-field v-if="editedIndex > -1" v-model="editedItem.refresh_token"
                            label="Refresh Token"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteSeller">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
    name: "accounts",
    data() {
      return {
        dialog: false,
        dialogDelete: false,
        headers: [
          {
            text: "Seller ID",
            align: "start",
            sortable: false,
            value: "ml_seller_id",
          },
          { text: "Nickname", value: "nickname" },
          { text: "Code", value: "code" },
          { text: "Access Token", value: "access_token" },
          { text: "Refresh Token", value: "refresh_token" },
          { text: "Auth Status", value: "auth_status" },
          { text: "Actions", value: "actions", sortable: false },
        ],
        accounts: [],
        editedIndex: -1,
        editedItem: {
          ml_seller_id: "",
          sellerid: "",
          access_token: "",
          refresh_token: "",
        },
        defaultItem: {
          ml_seller_id: "",
          sellerid: "",
          access_token: "",
          refresh_token: "",
        },
  
        loadingtable: false,
        authorization_token: ""
      };
    },
  
    created() {
      this.getAccounts();
    },
  
    computed: {
      // verifica se é edição ou uma nova conta
      formTitle() {
        return this.editedIndex === -1 ? "Add Account " : "Edit Account";
      },
    },
  
    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },
  
    methods: {
      getAccounts() {
        this.loadingtable = true;
        console.log('--- auth token ---')
        console.log(this.$store.state.authToken)
        axios
          .get(import.meta.env.VITE_BACKEND_URL + "/seller/index",
            {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json', Authorization: this.$store.state.authToken
              }
              
            })
          .then((res) => {
            this.accounts = res.data;
            console.log(res.data);
            this.loadingtable = false;
            console.log(res.headers)
          })
          .catch((error) => {
            console.log("--- erro no axios ---:");
            console.log(error);
            if (error.request.status === 401) {
              console.log("--- user não está logado ---:");
              this.$router.push('login')
            }
            this.loadingtable = false;
          });
      },
      save() {
        if (this.editedIndex > -1) {
          this.editSeller();
        } else {
          this.createSeller();
        }
      },
      createSeller() {
        console.log("--- create seller() ---");
        console.log('Token atual:');
        console.log(this.$store.state.authToken);
        axios
          .post(import.meta.env.VITE_BACKEND_URL + "/seller/create",
            {
              seller: {
                nickname: this.editedItem.nickname,
                code: this.editedItem.code,
                ml_seller_id: this.editedItem.ml_seller_id,
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
            this.getAccounts();
            this.close();
          });
      },
      editSeller() {
        console.log("Fazendo o update do seller");
        axios
          .post(import.meta.env.VITE_BACKEND_URL + "/seller/edit",
            {
              seller: {
                nickname: this.editedItem.nickname,
                code: this.editedItem.code,
                ml_seller_id: this.editedItem.ml_seller_id,
                access_token: this.editedItem.access_token,
                refresh_token: this.editedItem.refresh_token,
              }
            },
            { headers: { Authorization: this.$store.state.authToken } }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
            if (error.request.status === 401) {
              console.log("--- user não está logado ---:");
              this.$router.push('login')
            }
          })
          .finally(() => {
            this.getAccounts();
            this.close();
          });
      },
  
      deleteSeller() {
        console.log(this.editedItem.ml_seller_id);
        axios
          .post(import.meta.env.VITE_BACKEND_URL + "/seller/delete",
            { seller: { ml_seller_id: this.editedItem.ml_seller_id, } },
            { headers: { Authorization: this.$store.state.authToken } }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
            if (error.request.status === 401) {
              console.log("--- user não está logado ---:");
              this.$router.push('login')
            }
          })
          .finally(() => {
            this.getAccounts();
            this.closeDelete();
          });
      },
      close() {
        // altereii um pouco pra ver o que acontece
        this.dialog = false;
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      },
      editItem(item) {
        this.editedIndex = this.accounts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        this.editedIndex = this.accounts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        console.log(this.editedItem.ml_seller_id);
        this.dialogDelete = true;
      },
      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
    },
  };
  </script>
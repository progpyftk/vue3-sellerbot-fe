<template>
    - teste do user: {{ $store.state.currentUser }}
    - teste do user: {{ $store.state.authToken }}
    <div v-if="$store.state.currentUser === 'not logged'">
        <div></div>
      <div v-if="logging">
        <v-flex>
          <v-card class="d-flex align-center justify-center" height="400px">
            <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
          </v-card>
        </v-flex>
      </div>
  
      <div v-else>
        <v-card v-if="loginform" class="pa-8" outlined tile>
          <v-card class="pa-md-8 mx-auto" max-width="400">
            <v-card-title>Seller Bot - Login </v-card-title>
            <v-card-text>
              <form @submit.prevent="submit">
                <v-text-field
                  color="primary"
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  required
                  @blur="validateEmail"
                ></v-text-field>
  
                <v-text-field
                  v-model="password"
                  :error-messages="passwordErrors"
                  label="Password"
                  type="password"
                  required
                  @blur="validatePassword"
                ></v-text-field>
  
                <v-card-actions>
                  <v-btn color="primary" class="mr-4" type="submit" :disabled="!isFormValid">
                    Login
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card-text>
          </v-card>
        </v-card>
  
        <v-card v-else class="pa-8" outlined tile>
          <v-card class="pa-md-8 mx-auto" max-width="400">
            <v-card-title>Welcome to Seller Bot!</v-card-title>
            <v-card-text>
              Increase your sells!
            </v-card-text>
          </v-card>
        </v-card>
      </div>
    </div>
    <div v-else>
      <v-card class="pa-8" outlined tile>
        <v-card class="pa-md-8 mx-auto" max-width="400">
          <v-card-title>Seller Bot</v-card-title>
          <v-card-text>
            Hello {{ $store.state.currentUser }}, you are already logged in!
          </v-card-text>
        </v-card>
      </v-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: '',
        authorization_token: '',
        logging: false,
        loginform: true,
        loginsucess: false,
        login_error_message: '',
        emailErrors: [],
        passwordErrors: [],
        temp: 'not logged',
      };
    },
    computed: {
      isFormValid() {
        return this.emailErrors.length === 0 && this.passwordErrors.length === 0;
      },
    },
    methods: {
      validateEmail() {
        this.emailErrors = [];
        if (!this.email) {
          this.emailErrors.push('E-mail is required.');
        } else if (!/.+@.+\..+/.test(this.email)) {
          this.emailErrors.push('Please enter a valid email.');
        }
      },
      validatePassword() {
        this.passwordErrors = [];
        if (!this.password) {
          this.passwordErrors.push('Password is required.');
        } else if (this.password.length < 6) {
          this.passwordErrors.push('Password must be at least 6 characters long.');
        }
      },
      submit() {
        this.validateEmail();
        this.validatePassword();
  
        if (this.isFormValid) {
          this.logging = true;
          axios.post(import.meta.env.VITE_BACKEND_URL + '/login', {
            user: {
              email: this.email,
              password: this.password,
            },
          })
          .then((res) => {
            this.authorization_token = res.headers.authorization;
            this.$store.state.authToken = res.headers.authorization;
            this.$store.state.currentUser = res.data.current_user;
            this.loginform = false;
            this.loginsucess = true;
          })
          .catch((error) => {
            this.login_error_message = 'Login not successful: ' + error.message;
          })
          .finally(() => {
            this.logging = false;
          });
        } else {
          console.log('Form is invalid.');
        }
      },
      clear() {
        this.email = '';
        this.password = '';
        this.emailErrors = [];
        this.passwordErrors = [];
      },
    },
  };
  </script>
  
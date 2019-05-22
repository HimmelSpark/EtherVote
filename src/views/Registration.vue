<!--suppress ALL -->

<template>
  <v-container>
    <v-container
        fill-height
        fluid
        justify-center>
      <v-flex
          xs12
          md6
          sm6
          lg6>

        <material-card
            color="green"
            title="Registration form"
            text="Provide your credentials">

          <v-form
              @keyup.enter="onSubmit"
              v-model="valid"
              ref="form"
              validation>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                      :rules="emailRules"
                      v-model="email"
                      label="Email"/>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                      type="password"
                      :counter="8"
                      :rules="passwordRules"
                      v-model="password"
                      label="Пароль"/>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                      type="password"
                      :counter="8"
                      v-model="confirm"
                      label="Подтвердите пароль"/>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                      type="password"
                      v-model="passphrase"
                      label="Кодовая фраза"/>
                </v-flex>
                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="success"
                      :loading="loading"
                      @click="onSubmit">
                    Sign up
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-container>
    <v-container
        fill-height
        fluid
        align-center>
      <v-flex
          xs12
          md12
          sm12
          lg12
          class="text-xs-center"
      >
        <router-link tag="a" class="col" class-active="active" to="/login">Уже есть учетная запись?</router-link>
      </v-flex>

    </v-container>
  </v-container>
</template>

<script>
  export default {
	data: () => ({
	  email: "",
	  password: "",
	  confirm: "",
	  passphrase: "",
	  valid: false,
	  emailRules: [
		v => !!v || "E-mail is required",
		v => /.+@.+/.test(v) || "E-mail must be valid"
	  ],
	  passwordRules: [
		v => !!v || "Password is required",
		v => (v && v.length >= 8) || "Too short password"
	  ],
	  confirmRules: [
		v => !!v || "Confirmation is required",
		v => !!v === this.password || "Passwords did not match"
	  ],
	  passwordConfirmRules: [
		v => !!v || "Password confirmation is required",
		v => v === this.password || "Passwords didn't match"
	  ]

	}),
	methods: {
	  async onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('setLoading', true)
        let user = {
          email: this.email,
          password: this.password,
        };
        const data = await this.web3.web3Instance().eth.personal.newAccount(this.passphrase)
		    this.$store.dispatch('setLoading', false)
        user.publicKey = data
        this.$store.dispatch("registerUser", user)
          .then(() => {
            this.$router.push("/");
          })
          .catch(err => console.log(err));
      }
	  }
	},
	computed: {
	  web3() {
		  return this.$store.getters.getWeb3;
	  },
    user() {
	    return this.$store.getters.user;
    },
    loading () {
      return this.$store.getters.loading;
    }
	},

    watch: {
      web3(v) {
         if (!!v === null || !!v === undefined) {
           this.$store.dispatch('setError', "Сеть блокчейна недоступна")
         } else {
           this.$store.dispatch('setError', "Сеть блокчейна подключена")
         }
      }
    }
  }
</script>

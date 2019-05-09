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
                        title="Login Form"
                        text="Provide your credentials">

                    <v-form
                            @keypress.enter="onSubmit"
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
                                            label="Password"/>
                                </v-flex>
                                <v-flex xs12 text-xs-right>
                                    <v-btn
                                            class="mx-0 font-weight-light"
                                            color="success"
                                            :disabled="!valid || loading"
                                            :loading="loading"
                                            @click="onSubmit">
                                        Login
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
                <router-link tag="a" class="col" class-active="active" to="/registration">Do not have an account?
                </router-link>
            </v-flex>
        </v-container>

    </v-container>


</template>

<script>
  export default {
	data: () => ({
	  email: "",
	  password: "",
	  valid: false,
	  emailRules: [
		v => !!v || "E-mail is required",
		v => /.+@.+/.test(v) || "E-mail must be valid"
	  ],
	  passwordRules: [
		v => !!v || "Password is required",
		v => (v && v.length >= 8) || "Too short password"
	  ]

	}),
	methods: {
	  onSubmit() {
		if (this.$refs.form.validate()) {
		  const user = {
			email: this.email,
			password: this.password
		  };
		  console.log(user);
		  this.$store.dispatch("authUser", user)
			  .then(() => {
				this.$router.push("/");
			  })
			  .catch(err => console.log(err));
		}
	  }
	},
    computed: {
	  loading () {
		return this.$store.getters.loading;
	  }
    }
  }
</script>

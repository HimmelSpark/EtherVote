<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      wrap
    >
      <v-flex md3 sm6 xs12>
        <v-text-field
            readonly
            @click="copy('mail')"
            id="mail"
            label="Ваш Email"
            v-model="user.email">
        </v-text-field>
      </v-flex>

      <v-flex md3 sm6 xs12>
        <v-text-field
            readonly
            @click="copy('key')"
            id="key"
            label="Ваш публичный ключ"
            v-model="user.publicKey">
        </v-text-field>
      </v-flex>

      <v-flex md3 sm6 xs12>
        <v-btn left color="red" @click="dialog = true">Сбросить аккаунт</v-btn>
      </v-flex>

      <v-dialog v-model="dialog" max-width="390">
        <v-card>
          <v-card-title class="display-1">Внимание!</v-card-title>
          <v-card-text class="headline">
            Вы собираетесь сбросить Ваш публичный ключ, что приведет к потере ВСЕХ ваших голосований!
            <v-text-field
            v-model="newPassphrase"
            type="password"
            label="Новое кодовое слово">
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer>
              <v-btn color="green" @click="dialog = false">Отменить</v-btn>
              <v-btn color="red" @click="restoreAccount">Сбросить</v-btn>
            </v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
	    newPassphrase: '',
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    web3() {
      return this.$store.getters.getWeb3;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
	  copy(id) {
	    let key = document.getElementById(id);
	    key.select();
	    document.execCommand("copy");
	    this.$store.dispatch('setError', 'Скопировано в буфер обмена');
    },
	  async restoreAccount() {
	    const user = this.user;
	    try {
	      this.$store.dispatch('setLoading', true);
		    user.publicKey = await this.web3.web3Instance().eth.personal.newAccount(this.newPassphrase);
		    this.$store.dispatch('setLoading', false);
		    this.$store.dispatch('restoreUser', user).then(() => {
		      this.dialog = false;
		      this.$store.dispatch('loadUser')
		    })
	    } catch (e) {
        this.$store.dispatch('setError', e);
		    this.dialog = false;
	    }
    }
  }
}
</script>

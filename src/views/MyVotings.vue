<template>
  <v-container>
    <v-layout
      col
      wrap
      align-center>
      <template v-for="(voting, index) in votings">
        <v-flex
          :key="index"
          xs12
          md6
          lg4>
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 12 : 2}`"
              class="mx-auto voteCard">
              <v-card-title>
                <v-chip :color="voting.color">#{{ index + 1 }}</v-chip>
                {{ voting.name }}
              </v-card-title>
              <v-card-text>
                <template v-for="(i, index) in voting.options">
                  <template v-if="index <= 2">
                    <v-chip :key="i">{{ i }}</v-chip>
                  </template>

                  <template v-else>
                    <v-chip
                      :key="i"
                      dark
                      color="tertiary">...</v-chip>
                  </template>
                </template>
              </v-card-text>
            </v-card>

          </v-hover>

        </v-flex>

        <v-flex
          :key="voting"
          xs1/>

      </template>

      <v-btn
        icon
        round
        color="blue"
        @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>

    </v-layout>
    <v-dialog v-model="dialog" max-width="580">

          <material-card
              color="green"
              title="Форма голосования"
              text="Введите данные нового голосования">

            <v-form
                @keyup.enter="onSubmit"
                v-model="valid"
                ref="form"
                validation>
              <v-container py-0>
                <v-layout wrap>

                  <v-flex xs4>
                    <v-text-field
                        counter="20"
                        v-model="name"
                        label="Название голосования"/>
                  </v-flex>

                  <v-flex xs8>
                    <v-text-field
                        counter="40"
                        v-model="description"
                        label="Описание голосования"/>
                  </v-flex>

                  <v-flex xs12>
                    <v-radio-group v-model="vCount" label="Количество вариантов" row>
                      <v-radio
                          v-for="n of [2,3,4]"
                          :key="n"
                          :label="n"
                          :value="n"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <template v-for="i  in vCount">
                    <v-flex xs6>
                      <v-card>
                        <v-card-text>
                          <v-text-field
                              :key="i"
                              counter="20"
                              v-model="variants[i-1].name"
                              label="Имя варианта"
                          />
                          <v-text-field
                              :key="i+4"
                              counter="40"
                              v-model="variants[i-1].description"
                              label="Описание варианта"
                          />
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </template>

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
                        @click="addVoting">
                      Создать
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </material-card>

        </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      votings: [
        { id: 1, name: 'Выборы Пупа Земли', options: ['Яafadadas', 'Тasdasы', 'Онasdas'], color: 'red' },
        { id: 2, name: 'Выборы ***зидента', options: ['Я', 'Ты', 'Он', 'kjjhgh'], color: 'green' },
        { id: 3, name: 'Выборы ради выборов', options: ['Я', 'Ты', 'Он'], color: 'orange' }
      ],
      dialog: false,
	    valid: false,
      name: '',
      description: '',
	    vCount: 0,
      variants: [
      	{name:'', description:''},
        {name:'', description:''},
        {name:'', description:''},
        {name:'', description:''},
      ],
	    passphrase: '',
    }
  },
  computed: {
    web3() {
      return this.$store.getters.getWeb3;
    },
    user() {
      return this.$store.getters.user;
    },
	  votingContractJSON() {
      return this.$store.getters.votingContractJSON
    },
	  votingContractHex() {
	    return this.$store.getters.votingContractHex
    },
  },
  methods: {
	  async addVoting () {
	    let voting = {
	      name: this.name,
		    description: this.description,
		    variants: this.variants.filter(v => v.name !== '' && v.description !== '')
      };
      console.log(voting);

	    let ballotContract = this.web3.web3Instance().eth.Contract(this.votingContractJSON);

	    await this.web3.web3Instance().eth.personal.unlockAccount(this.user.publicKey, this.passphrase,100000);

	    await ballotContract
          .deploy({
		        data: this.votingContractHex,
		        arguments: [this.vCount]
          })
          .send({from: this.user.publicKey, gas: '4700000', gasPrice: 100})
          .on('transactionHash', (hash) => {
            voting.blockKey = hash;
			      this.$store.dispatch('createVote', voting)
          })
          .on('confirmation', (confirmationNumber, receipt) => {})
          .on('receipt', (receipt) => {});
    }
  }

}

/*

1.


 */
</script>

<style>
  .voteCard {
    margin: 5%;
  }
</style>

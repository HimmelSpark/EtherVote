<template>
  <v-container>
    <v-layout
      col
      wrap
      align-center>

      <template v-if="votings.length === 0">
        <span class="display-1">Вы еще не создавали голосования</span>
      </template>

      <template v-for="(voting, index) in votings">
        <v-flex
          :key="index"
          xs12
          md6>
          <v-hover>
            <v-card
              :to="`voting/${voting.id}`"
              :class="`elevation-${hover ? 12 : 2}`"
              slot-scope="{ hover }"
              class="ma-auto voteCard">

              <v-card-title>
                <v-chip label>#{{index+1}}</v-chip>
                <span class="headline">{{voting.name}}</span>
              </v-card-title>

              <v-card-text>
                <span>{{voting.description}}</span>
                <br>
                <template v-for="v in voting.variants">
                  <v-chip>{{v.name}}</v-chip>
                </template>

              </v-card-text>

            </v-card>

          </v-hover>

        </v-flex>

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
                      <template v-for="n of [2,3,4]">
                        <v-radio
                            :key="n"
                            :label="n.toString()"
                            :value="n"
                        ></v-radio>
                      </template>
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
                        @click="addVoting"
                        :loading="loading">
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
	  votings() {
      return this.$store.getters.myVotings
    },
    loading() {
      return this.$store.getters.loading;
    }

  },
  methods: {
	  async addVoting () {

	    this.$store.dispatch('setLoading', true);

	    try {
        let voting = {
          name: this.name,
          description: this.description,
          variants: this.variants.filter(v => v.name !== '' && v.description !== '')
        };
        console.log(voting);
        console.log(this.votingContractJSON);
        console.log(this.votingContractHex);

        console.log(this.user.publicKey);
        console.log(this.passphrase);


        let ballotContract =new this.web3.web3Instance().eth.Contract(this.votingContractJSON);

        await this.web3.web3Instance().eth.personal.unlockAccount(this.user.publicKey, this.passphrase, 100000);

        await ballotContract.deploy({
          data: this.votingContractHex,
          arguments: [this.vCount]
        })
          .send({from: this.user.publicKey, gas: '4700000', gasPrice: 10})
          .on('transactionHash', (hash) => {
            voting.blockKey = hash;
            this.$store.dispatch('createVote', voting)
              .then(() => {
              this.$store.dispatch('loadMyVotings');
              this.dialog = false;
              })
              .catch(() => {
              this.dialog = false;
              })
          })
          .on('confirmation', (confirmationNumber, receipt) => {})
          .on('receipt', (receipt) => {});
	    } catch (e) {
		    console.log(e);
		    this.dialog = false;
		    this.$store.dispatch('setError', e.message);
		    this.$store.dispatch('setLoading', false);
  	  }

	    this.$store.dispatch('setLoading', false);
	    this.dialog = false;

    }
  }
}

/*

1.


 */
</script>

<style>
  .voteCard {
  }
</style>

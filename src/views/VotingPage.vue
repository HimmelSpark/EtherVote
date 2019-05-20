<template>
  <v-container
      fill-height
      fluid
      justify-center>

    <v-layout row wrap>

      <v-btn icon color="black" @click="$router.go(-1)"><v-icon>arrow_back</v-icon></v-btn>

      <v-layout row wrap align-center justify-center>
        <v-flex xs12>
          <material-card>
            <v-card-text class="text-xs-center">
              <h2 class="card-title font-weight-light">{{ voting.name }}</h2>
              <p class="card-description font-weight-light">Описание голосования: {{ voting.description }}</p>
              <p class="card-description font-weight-light">Количество голосующих (сервер): {{ voting.variants.length }}</p>
              <p class="card-description font-weight-light">Количество голосующих (блокчейн): {{ chainData.votersNum}}</p>
              <v-layout row wrap>
                <template v-for="(v,i) in voting.variants">
                  <v-flex xs12 sm6 md4 lg3>
                    <v-card>
                      <v-card-title>
                        <template v-if="chainData.winningProposal === i && chainData.proposalVotes[chainData.winningProposal] !== 0">
                          <v-chip label dark color="green">#{{i+1}}</v-chip>:{{v.name}}
                        </template>
                        <template v-else>
                          <v-chip label>#{{i+1}}</v-chip>:{{v.name}}
                        </template>
                      </v-card-title>
                      <v-card-text>
                        <p>Описание: {{v.description}}</p>
                        <p>Количество голосов: {{chainData.proposalVotes[i]}}</p>
                      </v-card-text>

                      <template v-if="voting.voted !== null">
                        <v-card-actions align-center justify-center>
                          <v-layout row>
                            <v-flex xs12>
                              <v-btn
                                  color="green"
                                  :disabled="voting.voted === true"
                                  @click="vote(i)">
                                <v-icon left>how_to_vote</v-icon>
                                Проголосовать
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-actions>
                      </template>

                    </v-card>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark @click="loadChainData">
                <v-icon left>insert_chart</v-icon>
                Загрузить данные из блокчейна
              </v-btn>
            </v-card-actions>
          </material-card>
        </v-flex>

        <v-flex xs12>
          <v-btn color="green" @click="addDialog = true">Добавить участника</v-btn>
        </v-flex>

        <v-flex xs12>
          <material-card
              color="green"
              title="Список участников голосования"
          >
            <v-data-table
                :headers="headers"
                :items="people"
                hide-actions
            >

              <template
                  slot="headerCell"
                  slot-scope="{ header }"
              >
              <span
                  class="subheading font-weight-light text-success text--darken-3"
                  v-text="header.text"
              />
              </template>

              <template
                slot="items"
                slot-scope="{ item }"
              >
                <td>{{ item.num }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.publicKey }}</td>
                <td>
                  <v-btn icon round color="red">
                    <v-icon @click="deleteTeacherModal = true; teacherToDelete = item.id">delete</v-icon>
                  </v-btn>
                </td>
              </template>

            </v-data-table>
          </material-card>
        </v-flex>
      </v-layout>
    </v-layout>

    <v-dialog max-width="390" v-model="addDialog">
      <material-card
          color="green"
          title="Форма нового участника">

        <v-form
            @keypress.enter="onSubmit"
            v-model="valid"
            ref="form"
            validation>
          <v-container py-0>
            <v-layout wrap>
              <v-flex xs12>

                {{user_id}}

                <v-overflow-btn
                    :items="allPeople"
                    label="Email"
                    editable
                    item-value="id"
                    v-model="user_id"
                ></v-overflow-btn>

              </v-flex>
              <v-flex xs12>
                <v-text-field
                    type="password"
                    v-model="passPhrase"
                    label="Кодовое слово"/>
              </v-flex>
              <v-flex xs12 text-xs-right>
                <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    :disabled="!valid || loading"
                    :loading="loading"
                    @click="onSubmit">
                  Добавить
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
        valid: false,
		    headers: [
          {
            sortable: false,
            text: '№',
            value: 'num'
          },
          {
            sortable: true,
            text: 'Email',
            value: 'email'
          },
          {
            sortable: false,
            text: 'Публичный ключ',
            value: 'publicKey'
          },
          {
            sortable: false,
            text: '🗑',
            value: null
          }],
		    addDialog: false,
		    passPhrase: '',
        user_id: '',
      }
    },
    computed: {
	    web3() {
		    return this.$store.getters.getWeb3;
	    },
      voting() {
        return this.$store.getters.voting
      },
      user() {
        return this.$store.getters.user;
      },
      votingContractJSON() {
        return this.$store.getters.votingContractJSON
      },
      people() {
        return this.$store.getters.people.map((curr, i) => {
          curr.num = i + 1;
          return curr;
        })
      },
      allPeople() {
        return this.$store.getters.allPeople
            .filter(p => !this.people.find(curr => curr.id === p.id))
            .map(c => {
              c.text = c.email;
              return c;
            })
      },
      chainData() {
	      return this.$store.getters.chainData
      },
      loading() {
	      return this.$store.getters.loading
      }
    },

    methods: {

	    async onSubmit() {
	      try {
          let receipt = await this.web3.web3Instance().eth.getTransactionReceipt(this.voting.blockKey);
          if (receipt === null) {
            this.$store.dispatch('setError', 'Контракт еще не обработан!');
            return;
          }
          console.log("receipt", receipt.contractAddress);
          console.log("pki", this.publicKey());
          console.log("amdinpki", this.user.publicKey);
          let ballotContract = new this.web3.web3Instance().eth.Contract(this.votingContractJSON, receipt.contractAddress);
          await this.web3.web3Instance().eth.personal.unlockAccount(this.user.publicKey, this.passPhrase, 100000);
          let response = ballotContract.methods.giveRightToVote(this.publicKey()).send({from: this.user.publicKey});
          this.$store.dispatch('addUserToVote', {user_id:this.user_id, vote_id: this.voting.id})
              .then(() => this.$store.dispatch('loadPeopleByVoteId', this.voting.id)
                  .then(() => this.addDialog = false))
        } catch (e) {
		      this.$store.dispatch('setError', e);
	        console.log(e)
        }
		  },
      async loadChainData() {
        let receipt = await this.web3.web3Instance().eth.getTransactionReceipt(this.voting.blockKey);
        let ballotContract = new this.web3.web3Instance().eth.Contract(this.votingContractJSON, receipt.contractAddress);
        ballotContract.methods.votersNum().call({from:this.user.publicKey}, (err, res) => {
          console.log(res);
          // this.voting.pCount = res
        })
      },


      async vote(num) {
	      console.log('voting for candidate #', num);
		    let receipt = await this.web3.web3Instance().eth.getTransactionReceipt(this.voting.blockKey);
		    let ballotContract = new this.web3.web3Instance().eth.Contract(this.votingContractJSON, receipt.contractAddress);
            ballotContract.methods.votersNum().call({from:this.user.publicKey},
                function (err,data) {
                  console.log("VOTERS NUM:",data);
                })
		    await this.web3.web3Instance().eth.personal.unlockAccount(this.user.publicKey, '12345678', 100000); //TODO не забыть
		    ballotContract.methods.vote(num).send({from: this.user.publicKey}, () =>
			    this.$store.dispatch('voteForCandidate', this.voting.id)
				    .then(() => this.$store.dispatch('loadVotingById',this.voting.id)));

      },

      publicKey() {
	      for (let i = 0; i < this.allPeople.length; i++) {
	        if (this.allPeople[i].id === this.user_id) {
	          return this.allPeople[i].publicKey
          }
        }
      },
    }
  }
</script>

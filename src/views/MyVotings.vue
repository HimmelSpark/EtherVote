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
        @click="addVoting">
        <v-icon>add</v-icon>
      </v-btn>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    votings: [
      { id: 1, name: 'Выборы Пупа Земли', options: ['Яafadadas', 'Тasdasы', 'Онasdas'], color: 'red' },
	    { id: 2, name: 'Выборы ***зидента', options: ['Я', 'Ты', 'Он', 'kjjhgh'], color: 'green' },
      { id: 3, name: 'Выборы ради выборов', options: ['Я', 'Ты', 'Он'], color: 'orange' }
    ]
  }),
  computed: {

  },
  methods: {
	  addVoting () {
	    this.votings.push(
		    { id: this.votings.length, name: 'Выборы ради выборов', options: ['Я', 'Ты', 'Он'], color: 'orange' }
      )
    }
  }

}
</script>

<style>
  .voteCard {
    margin: 5%;
  }
</style>

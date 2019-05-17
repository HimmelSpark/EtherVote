<template>
  <v-container
      fill-height
      fluid
      justify-center>
    <v-layout row>

      <v-flex xs12>
        <template v-if="votes.length === 0">
          <span class="display-1">У вас нет доступных голосований</span>
        </template>

        <template v-for="(voting, index) in votes">
          <v-flex
              :key="index"
              xs12
              md6
              lg4>
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
      </v-flex>


    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    computed: {
      votes() {
        return this.$store.getters.allVotes;
      }
    },
    methods: {

    }
  }
</script>
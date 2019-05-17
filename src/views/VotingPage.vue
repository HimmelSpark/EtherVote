<template>
  <v-container
      fill-height
      fluid
      justify-center>

    <v-layout row>
      <v-btn icon color="black" @click="$router.go(-1)"><v-icon>arrow_back</v-icon></v-btn>
      <v-layout row>
        <v-flex xs12>
          <material-card>
            <v-card-text class="text-xs-center">
              <h2 class="card-title font-weight-light">{{ voting.name }}</h2>
              <p class="card-description font-weight-light">{{ voting.description }}</p>

              <v-layout row wrap>
                <template v-for="(v,i) in voting.variants">
                  <v-flex xs12 sm6 md4 lg3>
                    <v-card>
                      <v-card-title>
                        <v-chip label>#{{i+1}}</v-chip>:{{v.name}}
                      </v-card-title>
                      <v-card-text>
                        {{v.description}}
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </template>
              </v-layout>

            </v-card-text>
          </material-card>
        </v-flex>
      </v-layout>
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
      voting() {
        return this.$store.getters.voting
      }
    },
    methods: {

    }
  }
</script>
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

        <v-flex xs12>
          <v-btn color="green" @click="addDialog = true">Добавить участника</v-btn>
        </v-flex>

        <v-flex xs6>
          <material-card
              color="green"
              title="Teachers table"
              text="You can sort the data by clicking the header"
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

                <v-overflow-btn
                    :items="allPeople"
                    label="Email"
                    editable
                    item-value="publicKey"
                    v-model="publicKey"
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
            text: '🗑',
            value: null
          }],
		    addDialog: false,
		    publicKey: '',
		    passPhrase: '',
      }
    },
    computed: {
      voting() {
        return this.$store.getters.voting
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
      }
    },
    methods: {
	    onSubmit() {

      }
    }
  }
</script>
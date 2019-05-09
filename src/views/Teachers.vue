<template>
  <v-container>
    <v-layout wrap justify-center>

      <v-flex xs12>
        <v-btn color="success" @click="createTeacherModal = true">New Teacher</v-btn>
      </v-flex>

      <v-flex xs12>
        <material-card
            color="green"
            title="Teachers table"
            text="You can sort the data by clicking the header"
        >
          <v-data-table
              :headers="headers"
              :items="teachers"
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
                to="/"
            >
              <td>{{ item.email }}</td>
              <td>
                <v-btn icon round color="teal">
                  <v-icon @click="teacherToEdit = item; editTeacherModal = true">edit</v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn icon round color="red">
                  <v-icon @click="deleteTeacherModal = true; teacherToDelete = item.id">delete</v-icon>
                </v-btn>
              </td>
            </template>

          </v-data-table>

        </material-card>
      </v-flex>

      <v-dialog v-model="createTeacherModal" max-width="390">
        <material-card
            color="blue"
            title="Teacher Form"
            text="Provide new teacher info">

          <v-form
              @keypress.enter="createTeacher"
              v-model="teacherCreateValid"
              ref="form"
              validation>

            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                    label="Email"
                    type="email"
                    v-model="createTeacherEmail"
                  />
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    type="password"
                    v-model="createTeacherPassword"
                  />
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    label="Confirm password"
                    type="password"
                    v-model="createTeacherPasswordConfirm"
                  />
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="blue"
                      @click="createTeacher">
                    Save
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>

          </v-form>

        </material-card>
      </v-dialog>

      <v-dialog v-model="editTeacherModal" max-width="390">
        <material-card
            color="orange"
            title="Teacher Form"
            text="Edit teacher info">

          <v-form
              @keypress.enter="createTeacher"
              v-model="teacherEditValid"
              ref="form"
              validation>

            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      label="Email"
                      type="email"
                      v-model="teacherToEdit.email"
                  />
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="New password"
                      type="password"
                      v-model="teacherToEdit.password"
                  />
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Confirm password"
                      type="password"
                      v-model="editTeacherConfirm"
                  />
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="orange"
                      @click="editTeacher">
                    Save changes
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>

          </v-form>

        </material-card>
      </v-dialog>

      <v-dialog v-model="deleteTeacherModal" max-width="390">

        <material-card
            color="red"
            title="Deleting a teacher"
            text="This process is irreversible!">

          <v-card-actions>
            <v-btn color="success" @click="deleteTeacherModal = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="deleteTeacher">Delete</v-btn>
          </v-card-actions>

        </material-card>

      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      headers: [
        {
          sortable: true,
          text: 'Email',
          value: 'email'
        },
        {
          sortable: false,
          text: 'Edit',
          value: null
        },
        {
          sortable: false,
          text: 'Delete',
          value: null
        }
      ],

	    editTeacherModal: false,
	    teacherEditValid: false,
	    teacherToEdit: {
        email: null,
        password: null
      },
      editTeacherConfirm: null,

	    deleteTeacherModal: false,
	    teacherToDelete: null,

      createTeacherModal: false,
	    teacherCreateValid: false,
	    createTeacherEmail: null,
	    createTeacherPassword: null,
	    createTeacherPasswordConfirm: null,

    }),
    computed: {
      teachers() {
        return this.$store.getters.teachers;
      }
    },
    methods: {
	    createTeacher() {
        const teacher = {
          email: this.createTeacherEmail,
          password: this.createTeacherPassword,
        };
        this.$store.dispatch('addTeacher', teacher)
            .then(() => {
              this.$store.dispatch('loadTeachers')
            })
            .finally(() => {
				      this.createTeacherEmail = null;
				      this.createTeacherPassword = null;
				      this.createTeacherPasswordConfirm = null;
				      this.createTeacherModal = false;
            })
      },
      editTeacher() {
	      //TODO прописать редактирование учителя
      },
      deleteTeacher() {
	      //TODO прописать удаление учителя
        this.deleteTeacherModal = false;
      }
    }
  }
</script>
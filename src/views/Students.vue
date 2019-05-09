<template>
  <v-container
      fill-height
      fluid
      grid-list-xl
  >

    <v-layout
        wrap
        justify-center
    >

      <v-flex md12>
        <h4>Groups</h4>
      </v-flex>

      <v-flex md12>
        <v-card
        >
          <v-btn class="toolbar-items" color="success" @click="groupModal = true">New Group</v-btn>
          <v-btn class="toolbar-items" color="tertiary" @click="loadAllStudents">All</v-btn>
          <template v-for="group in groups">
            <v-btn class="toolbar-items" color="tertiary" @click="loadStudentsByGroup(group.id)">{{group.name}}</v-btn>
          </template>
          <v-spacer></v-spacer>
          <v-divider vertical></v-divider>
          <v-btn class="toolbar-items" color="success" @click="studentCreateModal = true">New Student</v-btn>
        </v-card>


      </v-flex>

      <v-flex
          md12
      >
        <material-card
            color="green"
            title="Students table"
            text="You can sort the data by clicking the header"
        >
          <v-data-table
              :headers="headers"
              :items="students"
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
              <td>{{ item.surname }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.group_id }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone }}</td>
              <td>
                <v-btn icon round color="teal">
                  <v-icon @click="studentToEdit = item; editStudentModal = true">edit</v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn icon round color="red">
                  <v-icon @click="deleteStudentModal = true; studentToDelete = item.id">delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>


      <v-dialog v-model="groupModal" max-width="390">
        <material-card
            color="blue"
            title="Group Form"
            text="Provide new Group info"
            dark>

          <v-form
              @keypress.enter="onSubmit"
              v-model="groupValid"
              ref="form"
              validation>
            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      v-model="groupName"
                      label="Group Name"/>
                </v-flex>

                <v-flex xs12>
                  <v-overflow-btn
                      :items="courses"
                      label="Course"
                      item-value="id"
                      v-model="groupCourse"
                  ></v-overflow-btn>
                </v-flex>

                <v-flex xs12>
                  <v-text-field label="Description" counter="40" v-model="groupDescription"></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <div style="color: black;">
                    <v-date-picker v-model="groupStartDate" color="red lighten-1" header-color="blue"></v-date-picker>
                  </div>
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="blue"
                      @click="createGroup">
                    Create
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-dialog>


      <v-dialog max-width="390" v-model="studentCreateModal">
        <material-card
            color="blue"
            title="Student Form"
            text="Provide new student info"
        >

          <v-form
              @keypress.enter="createStudent"
              v-model="studentCreateValid"
              ref="form"
              validation>

            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      label="Email"
                      type="email"
                      v-model="studentCreateEmail"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Name"
                      v-model="studentCreateName"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Surname"
                      v-model="studentCreateSurname"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Phone"
                      v-model="studentCreatePhone"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-overflow-btn
                      :items="groupsForDropdown"
                      label="Course"
                      item-value="id"
                      v-model="studentCreateGroupId"
                  ></v-overflow-btn>
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="blue"
                      @click="createStudent">
                    Create
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>


          </v-form>

        </material-card>
      </v-dialog>

      <v-dialog max-width="390" v-model="deleteStudentModal">
        <v-card>
          <v-card-title>
            <span>You are going to delete a student!</span>
          </v-card-title>
          <v-card-text>
            <span>This process is irreversible!</span>
          </v-card-text>
          <v-card-actions>
            <v-btn color="orange" @click="deleteStudentModal = false">cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="deleteStudent">delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog lazy max-width="390" v-model="editStudentModal">
        <material-card
            color="blue"
            title="Student Form"
            text="Edit student data"
        >

          <v-form
              @keypress.enter="createStudent"
              v-model="studentCreateValid"
              ref="form"
              validation>

            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      label="Email"
                      type="email"
                      v-model="studentToEdit.email"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Name"
                      v-model="studentToEdit.name"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Surname"
                      v-model="studentToEdit.surname"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Phone"
                      v-model="studentToEdit.phone"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-overflow-btn
                      :items="groupsForDropdown"
                      label="Course"
                      item-value="id"
                      v-model="studentToEdit.group_id[0]"
                  ></v-overflow-btn>
                </v-flex>

                <v-flex xs12>
                  <v-btn block color="red" dark>Restore password</v-btn>
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="blue"
                      @click="editStudent">
                    Save
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>

          </v-form>

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
		  text: 'Surname',
		  value: 'surname'
		},
		{
		  sortable: false,
		  text: 'Name',
		  value: 'name'
		},
		{
		  sortable: true,
		  text: 'Group',
		  value: 'group'
		},
		{
		  sortable: false,
		  text: 'Email',
		  value: 'email'
		},
		{
		  sortable: false,
		  text: 'Phone Number',
		  value: 'phone'
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
		},
	  ],

	  groupModal: false,
	  groupValid: false,
	  groupName: null,
	  groupCourse: null,
	  groupStartDate: new Date().toISOString().substr(0, 10),
	  groupDescription: null,

	  studentCreateModal: false,
	  studentCreateValid: false,
	  studentCreateEmail: null,
	  studentCreateName: null,
	  studentCreateSurname: null,
	  studentCreateGroupId: null,
	  studentCreatePhone: null,

	  deleteStudentModal: false,
	  studentToDelete: null,

	  editStudentModal: false,
	  studentToEdit: {
		email: null,
		name: null,
		surname: null,
		group_id: [],
		phone: null
	  },

	}),
	computed: {
	  students() {
		  return this.$store.getters.students;
	  },
	  groups() {
		  return this.$store.getters.groups;
	  },
	  groupsForDropdown() {
		return this.$store.getters.groups.map(curr => {
		  return {text: curr.name, id: curr.id}
		})
	  },
	  courses() {
		return this.$store.getters.courses.map(curr => {
		  return {text: curr.name, id: curr.id}
		})
	  }
	},
	methods: {
	  createGroup() {
		const newGroup = {
		  name: this.groupName,
		  course_id: this.groupCourse,
		  start_date: this.groupStartDate,
		  description: this.groupDescription
		};

		this.$store.dispatch('createGroup', newGroup)
			.then(() => this.$store.dispatch('loadGroups'));
		this.groupModal = false;
	  },
	  loadAllStudents() {
		this.$store.dispatch('loadStudents')
	  },
	  loadStudentsByGroup(id) {
		this.$store.dispatch('loadStudentsByGroupId', id)
	  },
	  createStudent() {
		const student = {
		  email: this.studentCreateEmail,
		  name: this.studentCreateName,
		  surname: this.studentCreateSurname,
		  group_id: [this.studentCreateGroupId],
		  phone: this.studentCreatePhone
		};
		this.$store.dispatch('createStudent', student)
			.then(() => this.$store.dispatch('loadStudents'))
			.finally(() => this.studentCreateModal = false)
	  },
	  deleteStudent() {
		if (this.studentToDelete !== null) {
		  this.$store.dispatch('deleteStudent', this.studentToDelete)
			  .then(() => this.$store.dispatch('loadStudents'))
			  .finally(() => this.deleteStudentModal = false);
		  this.studentToDelete = null;
		}
	  },
	  editStudent() {
		this.$store.dispatch('editStudent', this.studentToEdit)
			.then(() => this.$store.dispatch('loadStudents'))
			.finally(() => this.editStudentModal = false);
		this.studentToEdit = {
		  email: null,
		  name: null,
		  surname: null,
		  group_id: [],
		  phone: null
		}
	  }
	}
  }
</script>

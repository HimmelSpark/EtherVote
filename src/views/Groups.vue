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

      <v-flex
          md12
      >
        <material-card
            color="green"
            title="Groups table"
            text="You can sort the data by clicking the header"
        >
          <v-data-table
              :headers="headers"
              :items="tableGroups"
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
              <td>{{ item.name }}</td>
              <td>{{ item.course }}</td>
              <!--<td>{{ item.start_date }}</td>-->
              <td>{{ item.description }}</td>
              <td>{{ item.unit }}</td>
              <td>
                <v-btn icon round color="teal">
                  <v-icon @click="openEditGroupModal(item.id)">edit</v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn icon round color="red">
                  <v-icon @click="deleteGroupModal = true; groupToDelete = item.id">delete</v-icon>
                </v-btn>
              </td>
            </template>

          </v-data-table>

        </material-card>
      </v-flex>


      <v-dialog lazy max-width="390" v-model="editGroupModal">
        <material-card
            color="orange"
            title="Group Form"
            text="Edit group data"
        >

          <v-form
              @keypress.enter="createStudent"
              v-model="editGroupValid"
              ref="form"
              validation>

            <v-container py-0>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                      label="Name"
                      type="text"
                      v-model="groupToEdit.name"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <p>Course</p>
                  <v-overflow-btn
                      :items="dropDownCourses"
                      label="Editable Btn"
                      editable
                      item-value="text"
                      v-model="groupToEdit.course"
                  ></v-overflow-btn>
                </v-flex>

                <v-flex xs12>
                  <p>Unit</p>
                  <v-overflow-btn
                      :items="dropDownUnits"
                      label="Editable Btn"
                      editable
                      item-value="text"
                      v-model="groupToEdit.unit"
                  ></v-overflow-btn>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                      label="Description"
                      v-model="groupToEdit.description"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 text-xs-right>
                  <v-btn
                      class="mx-0 font-weight-light"
                      color="orange"
                      @click="editGroup">
                    Save
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-container>

          </v-form>

        </material-card>
      </v-dialog>

      <!--<v-dialog max-width="390" v-model="deleteGroupModal">-->
        <!--<v-flex-->
            <!--md12-->
        <!--&gt;-->
          <!--<material-card-->
              <!--color="red"-->
              <!--title="Deleting the group"-->
              <!--text="This process is irreversible!"-->
          <!--&gt;-->

            <!--<v-card-actions>-->
              <!--<v-btn color="blue" @click="deleteGroupModal = false">Cancel</v-btn>-->
              <!--<v-spacer></v-spacer>-->
              <!--<v-btn color="red" @click="deleteGroup">Delete</v-btn>-->
            <!--</v-card-actions>-->

          <!--</material-card>-->
        <!--</v-flex>-->
      <!--</v-dialog>-->

      <v-dialog v-model="deleteGroupModal" persistent max-width="440">
        <v-card>
          <v-card-title class="headline">
            Do you want to delete this group?
          </v-card-title>
          <v-card-text>
            This process is irreversible, you can't restore this group later!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" flat @click="deleteGroupModal = false">
              Cancel
            </v-btn>
            <v-btn color="error" flat @click="deleteGroup">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  export default {

    //TODO сделать список курсов и юнитов выпадающими списками!!! 🙀

    data: () => ({
      headers: [
        {
          sortable: true,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Course',
          value: 'course_id',
        },
        // {
        //   sortable: true,
        //   text: 'Start date',
        //   value: 'start_date'
        // },
        {
          sortable: false,
          text: 'Description',
          value: 'description'
        },
        {
          sortable: false,
          text: 'Current unit',
          value: 'curr_unit'
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

      deleteGroupModal: false,
      groupToDelete: null,

	    editGroupModal: false,
	    editGroupValid: false,
      groupToEdit: {
        name: null,
        course: null,
        description: null,
        // start_date: null, //TODO вернуть как Костян реализует на беке
        unit: null
      }

    }),
    computed: {
      tableGroups() {

        let tGroups = [];

        this.groups.forEach((currGroup) => {

          let courseName = null;
          this.courses.forEach((currCourse) => {
            if (currCourse.id == currGroup.course_id) {
              courseName = currCourse.name;
            }
          });

          let unitName = null;
          this.units.forEach((currUnit) => {
            if (currUnit.id == currGroup.curr_unit) {
              unitName = currUnit.name;
            }
          });

          tGroups.push({
            id: currGroup.id,
            name: currGroup.name,
            course: courseName,
            description: currGroup.description,
            unit: unitName
          })

        });

        return tGroups;

      },
      groups() {
        return this.$store.getters.groups
      },
      courses() {
        return this.$store.getters.courses
      },
      dropDownCourses() {
        return this.$store.getters.courses.map((curr) => {
          return {
            id: curr.id,
            text: curr.name
          }
        });
      },
      units() {
        return this.$store.getters.units
      },
      dropDownUnits() {

        let course = null;
        let dUnits = [];

        for (let i = 0; i < this.courses.length; i++) {
          if (this.courses[i].name == this.groupToEdit.course) {
            course = this.courses[i];
          }
        }

        if (course !== null) {
		      for (let i = 0; i < this.units.length; i++) {
			      if (this.units[i].course_id == course.id) {
			        dUnits.push({id: this.units[i].id, text: this.units[i].unit_name});
            }
		      }
        }

        return dUnits;
      },

    },
    methods: {
      deleteGroup() {
        this.$store.dispatch('deleteGroup', this.groupToDelete)
            .then(() => {
              this.groupToDelete = null;
              this.$store.dispatch('loadGroups')
            });
        this.deleteGroupModal = false;
      },
      openEditGroupModal(id) {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.tableGroups[i].id == id) {
            this.groupToEdit = this.tableGroups[i];
            break;
          }
        }
        this.editGroupModal = true;
      },
	    editGroup() {
		    
        // найти id курса по его имени
        let cId = null;
        for (let i = 0; i < this.courses.length; i++) {
          if (this.courses[i].name === this.groupToEdit.course) {
            cId = this.courses[i].id;
          }
        }
        // TODO найти id юнита по его имени среди dropdown
        let uId = null;
        for (let i = 0; i < this.dropDownUnits.length; i++) {
          if (this.dropDownUnits[i].text === this.groupToEdit.unit) {
            uId = this.dropDownUnits[i].id;
          }
        }
        // TODO собрать данные и отправить
        this.groupToEdit.course_id = cId;
		    this.groupToEdit.course = undefined;
		    this.groupToEdit.unit_name = this.groupToEdit.unit;
		    this.groupToEdit.unit = undefined;

		    this.$store.dispatch('changeGroup', this.groupToEdit)
            // .then(() => this.$store.dispatch('loadGroups')) //TODO вернуть как будет на беке

		    this.editGroupModal = false;
      }
    }
  }
</script>

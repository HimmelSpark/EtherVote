<!--suppress ALL -->
<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex
          xs12
          md6
          sm6>
        <material-card>
          <v-avatar
              slot="offset"
              class="mx-auto d-block"
              size="130"
              tile
              @click="triggerUpload"
          >
            <v-hover>
            <v-img slot-scope="{ hover }"
                   :src="imgSrc">
              <v-expand-transition>
                <div
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text font-hover"
                        style="height: 100%;"
                >
                  Change
                </div>
              </v-expand-transition>
            </v-img>
            </v-hover>
          </v-avatar>
          <input
                  id="inputId"
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="onFileChange"
          />
          <v-card-text class="text-xs-center">
            <h3 class="card-title font-weight-light">{{ course.name }}</h3>
            <p class="card-description font-weight-light">{{ course.description }}</p>
            <v-btn
                color="main"
                class="font-weight-light"
                @click="openEditCourseDialog"
            >EDIT</v-btn>
          </v-card-text>

          <v-btn
                  flat
                  icon style="position: absolute; top:2%; right:2%"
                  @click="openDeleteCourseDialog"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon color="red" dark v-on="on">delete</v-icon>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-btn>
        </material-card>
      </v-flex>
    </v-layout>
    <hr>
    <v-layout row justify-center>
      <v-layout wrap>

        <template
            v-for="unit in units">
          <v-flex
              xs12
              md3
              sm3
              lg3
              class="ma-3">
            <v-card :to="'/unit/' + unit.id">
                  <v-card-title primary-title>
                    <div>
                      <h4>{{unit.unit_name}}</h4>
                      <h6>{{unit.description}}</h6>
                    </div>
                  </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <template v-for="tag in unit.tags">
                    <v-chip color="red" small dark>{{ tag }}</v-chip>
                  </template>
                </v-card-actions>
            </v-card>
          </v-flex>
        </template>
        <v-flex
                xs12
                md4
                sm4
                class="ma-3">
          <v-btn fab icon round color="primary" @click="openCreateUnitDialog"><v-icon>add</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </v-layout>

    <v-dialog
            v-model="createUnitDialog"
            max-width="490">
      <material-card
              color="red"
              title="Unit Form"
              text="Provide unit attributes">
        <v-form
                @keyup.enter="onSubmitCreateUnit"
                v-model="valid"
                ref="form"
                validation>
          <v-container py-0>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                        v-model="newUnitName"
                        label="Unit Name"/>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                        v-model="newUnitDescription"
                        label="Unit Description"/>
              </v-flex>
              <v-flex>
                <v-combobox
                        v-model="chipModel"
                        :filter="filter"
                        :hide-no-data="!chipSearch"
                        :items="chipItems"
                        :search-input.sync="chipSearch"
                        hide-selected
                        label="Unit tags"
                        multiple
                        small-chips
                        solo>

                  <template v-slot:no-data>
                    <v-list-tile>
                      <span class="subheading">Create</span>
                      <v-chip
                              :color="`${chipColors[chipNonce - 1]} lighten-3`"
                              label
                              small>
                        {{ chipSearch }}
                      </v-chip>
                    </v-list-tile>
                  </template>

                  <template v-slot:selection="{ item, parent, selected }">
                    <v-chip
                            v-if="item === Object(item)"
                            :color="`${item.color} lighten-3`"
                            :selected="selected"
                            label
                            small>
                              <span class="pr-2">
                                {{ item.text }}
                              </span>
                      <v-icon
                              small
                              @click="parent.selectItem(item)">close
                      </v-icon>
                    </v-chip>
                  </template>

                  <template v-slot:item="{ index, item }">
                    <v-list-tile-content>
                      <v-text-field
                              v-if="editing === item"
                              v-model="editing.text"
                              autofocus
                              flat
                              background-color="transparent"
                              hide-details
                              solo
                              @keyup.enter="edit(index, item)">
                      </v-text-field>
                      <v-chip
                              v-else
                              :color="`${item.color} lighten-3`"
                              dark
                              label
                              small>
                        {{ item.text }}
                      </v-chip>
                    </v-list-tile-content>
                    <v-spacer></v-spacer>
                    <v-list-tile-action @click.stop>
                      <v-btn
                              icon
                              @click.stop.prevent="edit(index, item)">
                        <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </template>

                </v-combobox>
              </v-flex>
              <v-flex xs12 text-xs-right>
                <v-btn
                        class="mx-0 font-weight-light"
                        color="red"
                        @click="onSubmitCreateUnit">
                  Create
                </v-btn>
              </v-flex>
              <v-flex xs12 text-xs-right>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </material-card>
    </v-dialog>

    <v-dialog v-model="deleteCourseDialog" persistent max-width="440">
      <v-card>
        <v-card-title class="headline">
          Do you want to delete this course?
        </v-card-title>
        <v-card-text>
          This process is irreversible, you can't restore this course later!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" flat @click="closeDeleteCourseDialog">
            Cancel
          </v-btn>
          <v-btn color="error" flat :loading="loadingToDelete" @click="deleteCourse">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
            v-model="editCourseDialog"
            max-width="490">
      <material-card
              color="blue"
              title="Edit Course"
              text="Provide course attributes">
        <v-form
                @keyup.enter="onSubmitEditCourse"
                v-model="valid"
                ref="editForm"
                validation>
          <v-container py-0>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                        v-model="newCourseName"
                        label="Course Name"/>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                        v-model="newCourseDescription"
                        label="Course Description"/>
              </v-flex>
              <v-flex xs12 text-xs-right>
                <v-btn
                        class="mx-0 font-weight-light"
                        color="blue"
                        @click="onSubmitEditCourse">
                  Save
                </v-btn>
              </v-flex>
              <v-flex xs12 text-xs-right>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </material-card>
    </v-dialog>
  </v-container>

</template>

<script>
  import API from '../utils/API.js';

  export default {
	data() {
	  return {
		editCourseDialog: false,
		createUnitDialog: false,
		deleteCourseDialog: false,
		newUnitName: null,
		newUnitDescription: null,
		loadingToDelete: false,
		newCourseName: null,
		newCourseDescription: null,
		imgSrc: API.baseUrl + API.method.courseImage + this.$store.getters.course.courseImage,
		chipModel: [],
		chipSearch: null,
		chipItems: [
		  {header: 'Tags'},
		],
		chipColors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
		chipNonce: 1
	  }
	},
	computed: {
	  course() {
		return this.$store.getters.course;
	  },

	  units() {
		return this.$store.getters.units;
	  }
	},
	methods: {
	  openCreateUnitDialog() {
		this.newUnitName = null;
		this.newUnitDescription = null;
		this.createUnitDialog = true;
	  },
	  closeCreateUnitDialog() {
		this.createUnitDialog = false;
	  },
	  openDeleteCourseDialog() {
		this.deleteCourseDialog = true;
	  },
	  closeDeleteCourseDialog() {
		this.deleteCourseDialog = false;
	  },
	  openEditCourseDialog() {
		this.newCourseName = null;
		this.newCourseDescription = null;
		this.editCourseDialog = true;
	  },
	  closeEditCourseDialog() {
		this.editCourseDialog = false;
	  },
	  onSubmitCreateUnit() {
		if (this.$refs.form.validate()) {
		  const unit = {
			unit_name: this.newUnitName,
			description: this.newUnitDescription,
			course_id: this.course.id,
			tags: this.chipModel.map(el => el.text)
		  };
		  console.log('unit ', unit);
		  this.$store.dispatch('createUnit', unit)
			  .then(() => this.$store.dispatch('loadUnitsByCourseId', this.course.id))
			  .finally(() => this.createUnitDialog = false)
		}
	  },
	  onSubmitEditCourse() {
		if (this.$refs.editForm.validate()) {
		  const editedCourse = {
			id: this.course.id,
			name: this.newCourseName,
			description: this.newCourseDescription
		  }
		  this.$store.dispatch('changeCourse', editedCourse)
			  .then(() => this.$store.dispatch('loadSingleCourseById', this.course.id))
			  .finally(() => this.editCourseDialog = false)
		}
	  },
	  deleteCourse() {
		this.loadingToDelete = true;
		this.$store.dispatch('deleteCourseById', {id: this.course.id})
			.then(() => {
			  this.deleteCourseDialog = false;
			  this.loadingToDelete = false;
			  this.$router.push('/courses');
			  this.$store.dispatch('loadCourses');
			})
			.catch((e) => {
			  console.error('error during deleting course: ', e);
			  this.deleteDialog = false;
			  this.loadingToDelete = false;
			})
	  },
	  triggerUpload() {
		this.$refs.fileInput.click();
	  },
	  onFileChange(event) {
		event.preventDefault();
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = event => {
		  this.imgSrc = reader.result;
		};
		reader.readAsDataURL(file);
		const input = document.getElementById('inputId');
		this.image = input.files[0];
		const img = this.image;
		const id = this.course.id;
		this.$store.dispatch('changeCourseImage', {img, id})
			.then(() => {
			  this.$store.dispatch('loadSingleCourseById', id);
			});
	  },

	  filter(item, queryText, itemText) {
		if (item.header) return false;
		const hasValue = val => val != null ? val : '';
		const text = hasValue(itemText);
		const query = hasValue(queryText);
		return text.toString()
			.toLowerCase()
			.indexOf(query.toString().toLowerCase()) > -1
	  },
	},
	watch: {
	  chipModel(val, prev) {
		if (val.length === prev.length) return;
		this.chipModel = val.map(v => {
		  if (typeof v === 'string') {
			v = {
			  text: v,
			  color: this.chipColors[this.chipNonce - 1]
			};
			this.chipItems.push(v);
			this.chipNonce++
		  }
		  return v
		})
	  }
	},
  }
</script>
<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .5;
    position: absolute;
    width: 100%;
  }
  .font-hover {
    font-size: 1.2em!important;
  }
</style>

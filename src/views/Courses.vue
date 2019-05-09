<!--suppress ALL -->
<template>
  <v-container
      fill-height
      fluid
      grid-list-xl>
    <v-layout wrap align-center>

      <template
      v-for="course in courses">
        <v-flex
            xs12
            md6
            sm5
            lg4
            class="ma-3">
          <v-hover>
            <v-card
                :to="'/course/' + course.id"
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 12 : 2}`">
              <v-layout>
                <v-flex xs5>
                  <v-img
                      :src="imgSrc + course.courseImage"
                      height="125px"
                      contain
                      class="ma-1"
                  ></v-img>
                </v-flex>
                <v-flex xs7>
                  <v-card-title primary-title>
                    <div>
                      <h4>{{course.name}}</h4>
                      <h6>{{course.description}}</h6>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
            </v-card>
          </v-hover>
        </v-flex>
      </template>
      <v-flex
          xs12
          md6
          sm5
          lg4
          class="ma-3">
        <v-btn fab icon round color="primary" @click="openDialog"><v-icon>add</v-icon></v-btn>
      </v-flex>
    </v-layout>

    <v-dialog
        v-model="dialog"
        max-width="490">
      <material-card
          color="blue"
          title="Course Form"
          text="Provide course attributes">
        <v-form
            @keyup.enter="onSubmitCreateCourse"
            v-model="valid"
            ref="form"
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
                    @click="onSubmitCreateCourse">
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
  </v-container>
</template>

<script>
  import API from '../utils/API.js';

  export default {
	data: () => ({
	  dialog: false,
	  newCourseName: null,
	  newCourseDescription: null,
	  valid: false
	}),
	computed: {
	  courses() {
		return this.$store.getters.courses;
	  },
	  imgSrc() {
		return API.baseUrl + API.method.courseImage;
	  }
	},
	methods: {
	  openDialog() {
		this.newCourseName = null;
		this.newCourseDescription = null;
		this.dialog = true;
	  },
	  closeDialog() {
		this.dialog = false;
	  },
	  onSubmitCreateCourse() {
		const course = {
		  name: this.newCourseName,
		  description: this.newCourseDescription
		};
		this.$store.dispatch('createCourse', course)
			.then(() => this.$store.dispatch('loadCourses'))
			.finally(() => this.dialog = false)
	  }
	}
  }
</script>

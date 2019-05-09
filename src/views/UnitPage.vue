<!--suppress ALL -->
<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex
          xs12
          md6
          sm6>
        <material-card>
          <v-card-text class="text-xs-center">
            <h2 class="card-title font-weight-light">{{ unit.unit_name }}</h2>
            <p class="card-description font-weight-light">{{ unit.description }}</p>
            <v-btn color="main" class="font-weight-light" @click="openEditUnitDialog">EDIT</v-btn>
          </v-card-text>
            <v-btn
                    flat
                    icon style="position: absolute; top:2%; right:2%"
                    @click="openDeleteUnitDialog"
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
    <br>
    <hr>
    <br>
    <v-layout row wrap justify-center>
      <v-flex v-for="(task, i) in tasks" :key="i" xs12 sm4 md3>
          <v-card hover class="ma-1"
          :to="'/task/' + task.id">
              <v-card-title primary-title>
                  <div style="width: 100%">
                      <div class="headline clip">{{ task.name }}</div>
                      <div class="grey--text clip">{{ task | question }}</div>
                  </div>
              </v-card-title>
          </v-card>
          <br>
      </v-flex>
        <v-flex
                xs12
                sm4
                md3
                class="ma-3">
            <v-btn fab icon round color="primary" @click="openCreateTaskDialog"><v-icon>add</v-icon></v-btn>
        </v-flex>
    </v-layout>

      <v-dialog v-model="deleteUnitDialog" persistent max-width="440">
          <v-card>
              <v-card-title class="headline">
                  Do you want to delete this unit?
              </v-card-title>
              <v-card-text>
                  This process is irreversible, you can't restore this unit later!
              </v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" flat @click="closeDeleteUnitDialog">
                      Cancel
                  </v-btn>
                  <v-btn color="error" flat :loading="loadingToDelete" @click="deleteUnit">
                      Delete
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog
              v-model="editUnitDialog"
              max-width="490">
          <material-card
                  color="red"
                  title="Unit Form"
                  text="Provide unit attributes">
              <v-form
                      @keyup.enter="onSubmitEditUnit"
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
                                      @click="onSubmitEditUnit">
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
      <v-dialog
              v-model="createTaskDialog"
              max-width="700">
          <material-card
                  color="blue"
                  title="Creating Task Form"
                  text="Provide task attributes">
              <v-form
                      @keyup.enter="onSubmitCreateTask"
                      v-model="valid"
                      ref="form"
                      validation>
                  <v-container py-0>
                      <v-layout wrap>
                          <v-flex xs12>
                              <v-overflow-btn
                                      :items="taskTypes"
                                      label="Task Type"
                                      item-value="id"
                                      v-model="taskType"
                                      :rules="notEmptyRules"
                              ></v-overflow-btn>
                          </v-flex>
                          <v-flex xs12>
                              <v-text-field
                                      label="Task Name"
                                      v-model="taskName"
                                      :rules="notEmptyRules"
                              />
                          </v-flex>
                          <!--ТАСК ПЕРВОГО ТИПА-->
                          <template v-if="taskType === taskTypes[0]">
                              <v-flex xs12>
                                  <v-text-field
                                          label="Enter question for the task"
                                          v-model="taskTextT1"
                                          :rules="notEmptyRules"
                                  />
                              </v-flex>
                              <v-flex xs12>
                                  <p>Choose amount of answers</p>
                                  <v-radio-group v-model="amountOfAnswers" row>
                                      <v-radio label="2" value=2></v-radio>
                                      <v-radio label="3" value=3></v-radio>
                                      <v-radio label="4" value=4></v-radio>
                                  </v-radio-group>
                              </v-flex>
                              <template v-for="n in Number.parseInt(amountOfAnswers) | parseIntFilter">
                                  <v-flex xs12>
                                      <v-text-field
                                              :label="n.toString() + ' answer'"
                                              v-model="answersT1[n]"
                                              :rules="notEmptyRules"
                                      />
                                  </v-flex>
                              </template>
                              <v-flex xs12>
                                  <v-overflow-btn
                                          :items="enteredAnswers"
                                          label="Choose a correct answer"
                                          item-value="id"
                                          v-model="correctT1"
                                          :rules="notEmptyRules"
                                  ></v-overflow-btn>
                              </v-flex>
                          </template>

                          <!--ТАСК ВТОРОГО ТИПА-->
                          <template v-if="taskType === taskTypes[1]">
                              <v-flex xs12>
                                  <v-text-field
                                          :rules="notEmptyRules"
                                          label="Type B"/>
                              </v-flex>
                          </template>
                          <!--ТАСК ТРЕТЬЕГО ТИПА-->
                          <template v-if="taskType === taskTypes[2]">
                              <v-flex xs12>
                                  <v-text-field
                                          :rules="notEmptyRules"
                                          label="Type C"/>
                              </v-flex>
                          </template>

                          <v-flex xs12 text-xs-right>
                              <v-btn
                                      :disabled="!valid"
                                      class="mx-0 font-weight-light"
                                      color="blue"
                                      @click="onSubmitCreateTask">
                                  Create
                              </v-btn>
                          </v-flex>
                      </v-layout>
                  </v-container>
              </v-form>
          </material-card>
      </v-dialog>
  </v-container>
</template>
<!--
{"id":7,
"name":"Серьезный вопрос",
"task_type":1,
"unit_id":[1],
"dataT1":"{
    \"text\": \"В каком году началась Великая Отечественная Война?\",
    \"answers\": [\"1812\", \"1939\", \"1914\"],
    \"correct\": \"1941\"}",
"dataT2":null,
"dataT3":null}-->
<script>
  export default {
	data() {
	  return {
		notEmptyRules: [
		  v => !!v || "The field must not be empty",
		],
		valid: false,
		deleteUnitDialog: false,
		loadingToDelete: false,
		editUnitDialog: false,
		createTaskDialog: false,
		newUnitName: null,
		newUnitDescription: null,
		chipModel: [],
		chipSearch: null,
		chipItems: [
		  {header: 'Tags'},
		],
		chipColors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
		chipNonce: 1,

		/**
		 * Типы тасков. Насколько я понимаю могут быть 1,2 или 3.
		 */
		taskTypes: ['Вопрос с вариантами ответов', 'Второй тип', 'Третий тип'],
		/**
		 * Выбранный тип таска
		 */
		taskType: null,
		taskName: null,
		taskTextT1: null,
		/**
		 * Выбранное количество вариантов ответов
		 */
		amountOfAnswers: null,
		/**
		 * Варианты ответа. При отправке будут выбираться те, что не пустые
		 */
		answersT1: {
		  1: null,
		  2: null,
		  3: null,
		  4: null,
		},
		correctT1: null
	  }
	},
	computed: {
	  unit() {
		return this.$store.getters.unit;
	  },

	  tasks() {
		return this.$store.getters.tasks;
	  },

	  course() {
		return this.$store.getters.course;
	  },

	  /**
	   * Выбираем не пустые варианты ответов перед отправкой
	   */
	  enteredAnswers() {
		let ans = [];
		for (let i = 1; i <= 4; ++i) {
		  if (this.answersT1[i.toString()]) {
			ans.push(this.answersT1[i.toString()]);
		  }
		}
		return ans;
	  }
	},

	methods: {
	  openDeleteUnitDialog() {
		this.deleteUnitDialog = true;
	  },
	  closeDeleteUnitDialog() {
		this.deleteUnitDialog = false;
	  },
	  openEditUnitDialog() {
		this.editUnitDialog = true;
	  },
	  closeEditUnitDialog() {
		this.editUnitDialog = false;
	  },
	  openCreateTaskDialog() {
		this.createTaskDialog = true;
	  },
	  closeCreateTaskDialog() {
		this.createTaskDialog = false;
	  },
	  deleteUnit() {
		this.loadingToDelete = true;
		this.$store.dispatch('deleteUnitById', {id: this.unit.id})
			.then(() => {
			  this.deleteUnitDialog = false;
			  this.loadingToDelete = false;
			  this.$router.push('/course/' + this.course.id);
			})
			.catch((e) => {
			  console.error('error during deleting unit: ', e);
			  this.deleteUnitDialog = false;
			  this.loadingToDelete = false;
			})
	  },

	  onSubmitCreateTask() {
		if (this.$refs.form.validate()) {
		  const type = this.taskTypes.indexOf(this.taskType) + 1; // приводим тип таска к виду: 1, 2 или 3
		  const createdTask = {
			name: this.taskName,
			task_type: this.taskTypes.indexOf(this.taskType) + 1,
			unit_id: [this.unit.id], // указываем юнит, к которому таск будет прикреплен
			dataT1: null,
			dataT2: null,
			dataT3: null
		  }

		  /**
		   * По негласному соглашению Костяна правильный ответ не должен присутствовать в вариантах ответов!(
		   * Поэтому убираем его от туда.
		   */
		  const ans = this.enteredAnswers.filter(answer => answer !== this.correctT1)

		  //todo добавить еще 2 типа
		  switch (type) {
			case 1:
			  createdTask.dataT1 = {
				text: this.taskTextT1,
				answers: ans,
				correct: this.correctT1
			  }
		  }
		  console.log('createdTask ', createdTask);
		  this.$store.dispatch('createTask', createdTask)
			  .then(() => {
				this.$store.dispatch('loadTasksByUnitId', this.unit.id)
			  })
			  .finally(() => this.closeCreateTaskDialog())
		}
	  },

	  onSubmitEditUnit() {
		console.log('onSubmitEditUnit');
		if (this.$refs.form.validate()) {
		  console.log('onSubmitEditUnitvaled');
		  const editedUnit = {
			id: this.unit.id,
			unit_name: this.newUnitName,
			description: this.newUnitDescription,
			course_id: this.course.id,
			tags: this.chipModel.map(el => el.text)
		  };
		  console.log('editedUnit ', editedUnit);
		  this.$store.dispatch('changeUnit', editedUnit)
			  .then(() => this.$store.dispatch('loadSingleUnitById', this.unit.id))
			  .finally(() => this.editUnitDialog = false)
		}
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
		  return v;
		})
	  }
	},
	filters: {
	  /**
	   * Фильтр необходимый для получения текста вопроса из поля dataT{X}, X - тип таска
	   * Фильры во vue работают по типу конвееров в bash. Ничего сложного. Инфа легко гуглтся.
	   */
	  question(task) {
		switch (task.task_type) {
		  case 1:
			return JSON.parse(task.dataT1).text;
		  case 2:
			return JSON.parse(task.dataT1).text;
		  case 3:
			return JSON.parse(task.dataT2).text;
		}
	  },

	  parseIntFilter(num) {
		return num ? num : 1;
	  }
	}
  }
</script>
<style scoped>
    .clip {
        white-space: nowrap; /* Запрещаем перенос строк */
        overflow: hidden; /* Обрезаем все, что не помещается в область */
        text-overflow: ellipsis; /* Добавляем многоточие */
        padding: 5px;
    }
</style>

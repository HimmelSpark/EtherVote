<!--suppress ALL -->
<template>
    <v-container>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 class="pa-1">
                <v-card>
                    <v-card-title>
                        <v-btn icon :to="'/unit/' + task.unit_id[0]">
                            <v-icon color="black">mdi-arrow-left</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                                flat
                                icon style="position: absolute; top:2%; right:2%"
                                @click="openDeleteTaskDialog"
                        >
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon color="red" dark v-on="on">delete</v-icon>
                                </template>
                                <span>Delete</span>
                            </v-tooltip>
                        </v-btn>
                    </v-card-title>

                    <!--ПЕРВВЫЙ ТИП ТАСКА-->
                    <template v-if="task.task_type === 1">
                        <v-card-title class="black--text pl-1 pt-1">
                            <div class="font-head pl-3 pt-1">Выберите правильный вариант ответа</div>
                        </v-card-title>
                        <v-card-title class="ml-5">
                            <div class="font-head">{{ taskDataConverter(task.dataT1).text }}</div>
                        </v-card-title>
                        <v-card-action>
                            <v-radio-group class="ml-5" column>
                                <v-radio
                                        v-for="(answer, i) in taskDataConverter(task.dataT1).answers"
                                        :label="answer" :value="answer"></v-radio>
                                <v-radio :value="taskDataConverter(task.dataT1).correct">
                                    <template v-slot:label>
                                        <strong class="success--text font-success">{{ taskDataConverter(task.dataT1).correct }}</strong>
                                    </template>
                                </v-radio>
                            </v-radio-group>
                        </v-card-action>
                    </template>
                    <template></template>
                    <template></template>
                </v-card>
            </v-flex>
            <v-flex xs12 hidden-sm-and-up class="mt-2 mb-2">
                <v-divider/>
            </v-flex>
            <v-flex xs12 sm6 class="pa1">
                <v-form
                            @keyup.enter="onSubmitEditTask"
                            v-model="valid"
                            ref="form"
                            validation>
                        <v-container py-0>
                            <v-layout wrap>
                                <!--ТАСК ПЕРВОГО ТИПА-->
                                <template v-if="task.task_type === 1">
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
                                <template v-if="task.task_type === 2">
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Type B"/>
                                    </v-flex>
                                </template>
                                <!--ТАСК ТРЕТЬЕГО ТИПА-->
                                <template v-if="task.task_type === 3">
                                    <v-flex xs12>
                                        <v-text-field
                                                label="Type C"/>
                                    </v-flex>
                                </template>
                                <v-flex xs12 text-xs-right>
                                    <v-btn
                                            :disabled="!valid"
                                            class="mx-0 font-weight-light"
                                            color="blue"
                                            @click="onSubmitEditTask">
                                        Edit
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
            </v-flex>
        </v-layout>
        <v-dialog v-model="deleteTaskDialog" persistent max-width="440">
            <v-card>
                <v-card-title class="headline">
                    Do you want to delete this task?
                </v-card-title>
                <v-card-text>
                    This process is irreversible, you can't restore this task later!
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" flat @click="closeDeleteTaskDialog">
                        Cancel
                    </v-btn>
                    <v-btn color="error" flat :loading="loadingToDelete" @click="deleteTask">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
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
		deleteTaskDialog: false,
		valid: false,
		taskTextT1: null,
		notEmptyRules: [
		  v => !!v || "The field must not be empty",
		],
		amountOfAnswers: null,
		answersT1: {
		  1: null,
		  2: null,
		  3: null,
		  4: null,
		},
		correctT1: null
	  }
	},
	methods: {
	  /**
	   * Принимает на вход поле dataT{X}, где X - тип таска.
	   * @returns {json} - возвращает это поле в виде json
	   */
	  taskDataConverter(taskData) {
		return JSON.parse(taskData);
	  },

	  onSubmitEditTask() {
		if (this.$refs.form.validate()) {
		  console.log('onSubmitEditTask');
		  const editedTask = {
			id: this.task.id,
			unit_id: this.task.unit_id,
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
		  switch (this.task.task_type) {
			case 1:
			  editedTask.dataT1 = {
				text: this.taskTextT1,
				answers: ans,
				correct: this.correctT1
			  }
		  }
		  console.log('editedTask ', editedTask);
		  this.$store.dispatch('editTask', editedTask)
			  .then(() => {
				this.$store.dispatch('loadSingleTaskById', this.task.id)
			  })
		}
	  },

	  openDeleteTaskDialog() {
		this.deleteTaskDialog = true;
	  },
	  closeDeleteTaskDialog() {
		this.deleteTaskDialog = false;
	  },
	  deleteTask() {
		this.loadingToDelete = true;
		this.$store.dispatch('deleteTaskById', {id: this.task.id})
			.then(() => {
			  this.deleteTaskDialog = false;
			  this.loadingToDelete = false;
			  this.$router.push('/unit/' + this.task.unit_id[0]);
			})
			.catch((e) => {
			  console.error('error during deleting task: ', e);
			  this.deleteTaskDialog = false;
			  this.loadingToDelete = false;
			})
	  },
	},
	computed: {
	  task() {
		return this.$store.getters.task;
	  },
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

	filters: {
	  parseIntFilter(num) {
		return num ? num : 1;
	  }
	}
  }
</script>

<style scoped>
    .font-head {
        font-size: 1.2em;
        font-weight: bold;
        font-family: 'Roboto', sans-serif;
    }
    .font-success {
        font-size: 16px;
    }
    .ma-t12 {
        margin-top: 12px;
    }
</style>


const baseUrl = 'http://localhost:8090/'

const method = {
  signin: 'user/auth',
  signup: 'user/register',
  logout: 'user/logout',
  adminInfo: 'user/info',
  loadTeachers: 'user/all',
  addTeacher: 'user/add',

  createCourse: 'course/create',
  schoolCourses: 'course/',
  deleteCourse: 'course/delete',
  courseImage: 'course/image/',
  changeCourseImage: 'course/changeAvatar',
  changeCourse: '/course/change',

  loadAllStudents: 'student/',
  loadStudentsByGroup: '/student/group/',
  createStudent: '/student/create',
  deleteStudent: '/student/delete',
  editStudent: '/student/change',

  loadGroups: 'group/',
  createGroup: 'group/create',
  deleteGroup: 'group/delete',
  changeGroup: 'group/edit',

  loadSchool: 'school/',
  saveSchool: 'school/change',

  courseUnitsById: 'unit/',
  createUnit: 'unit/create',
  unitById: '/unit/find/',
  deleteUnit: '/unit/delete',
  changeUnit: '/unit/change',
  allUnits: 'unit/all',

  tasksByUnitId: '/task/',
  taskById: '/task/find/',
  createTask: '/task/create',
  editTask: '/task/change',
  deleteTask: '/task/delete'
};

export default {baseUrl, method};

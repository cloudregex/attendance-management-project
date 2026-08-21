import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log("=== STARTING QA API TESTS ===");
  let adminToken = '';
  let createdDeptId = null;
  let createdStudentId = null;
  let createdTeacherId = null;
  let createdRoleId = null;
  let createdPermissionId = null;

  // 1. Health Checks
  console.log("\n--- Testing Public Health Checks ---");
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  console.log("GET /api/health Status:", healthRes.status, await healthRes.json());

  const dbTestRes = await fetch(`${BASE_URL}/api/db-test`);
  console.log("GET /api/db-test Status:", dbTestRes.status, await dbTestRes.json());

  // 2. Auth Tests
  console.log("\n--- Testing Authentication ---");
  // Test invalid login
  const invalidLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'wrong@admin.com', password: 'wrong' })
  });
  console.log("POST /api/admin/login (Invalid) Status:", invalidLoginRes.status, await invalidLoginRes.json());

  // Test valid login
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'system@gmail.com', password: 'system12345' })
  });
  const loginData = await loginRes.json();
  console.log("POST /api/admin/login (Valid) Status:", loginRes.status, loginData.message);
  adminToken = loginData.accessToken || loginData.token;

  // Test /api/admin/me
  const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/admin/me (Authorized) Status:", meRes.status);

  const meUnauthorizedRes = await fetch(`${BASE_URL}/api/admin/me`);
  console.log("GET /api/admin/me (Unauthorized) Status:", meUnauthorizedRes.status);

  // 3. Department Tests
  console.log("\n--- Testing Department Routes ---");
  const addDeptRes = await fetch(`${BASE_URL}/api/departments/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Computer Science QA', code: 'CSQA' })
  });
  const addDeptData = await addDeptRes.json();
  console.log("POST /api/departments/add Status:", addDeptRes.status, addDeptData);
  if (addDeptData.department) createdDeptId = addDeptData.department.id;

  const getDeptsRes = await fetch(`${BASE_URL}/api/departments`);
  console.log("GET /api/departments Status:", getDeptsRes.status);

  if (createdDeptId) {
    const getDeptByIdRes = await fetch(`${BASE_URL}/api/departments/${createdDeptId}`);
    console.log(`GET /api/departments/${createdDeptId} Status:`, getDeptByIdRes.status);

    const updateDeptRes = await fetch(`${BASE_URL}/api/departments/${createdDeptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Computer Science QA Updated' })
    });
    console.log(`PUT /api/departments/${createdDeptId} Status:`, updateDeptRes.status);
  }

  // 4. Student Tests
  console.log("\n--- Testing Student Routes ---");
  const addStudentRes = await fetch(`${BASE_URL}/api/students/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'John',
      last_name: 'Doe',
      email: `john.qa.${Date.now()}@example.com`,
      roll_number: `ROLL_${Date.now()}`,
      department_id: createdDeptId || 1,
      course: 'B.Tech',
      semester: 1
    })
  });
  const addStudentData = await addStudentRes.json();
  console.log("POST /api/students/add Status:", addStudentRes.status, addStudentData.message || addStudentData);
  if (addStudentData.student) createdStudentId = addStudentData.student.id;

  const getStudentsRes = await fetch(`${BASE_URL}/api/students`);
  console.log("GET /api/students Status:", getStudentsRes.status);

  // 5. Teacher Tests
  console.log("\n--- Testing Teacher Routes ---");
  const addTeacherRes = await fetch(`${BASE_URL}/api/teachers/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacher_name: 'Jane Smith',
      email: `jane.teacher.${Date.now()}@example.com`,
      password: 'password123',
      employee_id: `EMP_${Date.now()}`,
      department_id: createdDeptId || 1,
      designation: 'Assistant Professor'
    })
  });
  const addTeacherData = await addTeacherRes.json();
  console.log("POST /api/teachers/add Status:", addTeacherRes.status, addTeacherData.message || addTeacherData);
  if (addTeacherData.teacher) createdTeacherId = addTeacherData.teacher.id;

  const getTeachersRes = await fetch(`${BASE_URL}/api/teachers`);
  console.log("GET /api/teachers Status:", getTeachersRes.status);

  // 6. Role & Permission Tests
  console.log("\n--- Testing Role & Permission Routes ---");
  const getRolesRes = await fetch(`${BASE_URL}/api/roles/get`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/roles/get Status:", getRolesRes.status);

  const getPermsRes = await fetch(`${BASE_URL}/api/permissions/definitions/get`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/permissions/definitions/get Status:", getPermsRes.status);

  // 7. Academic Routes
  console.log("\n--- Testing Academic Routes ---");
  const academicOverviewRes = await fetch(`${BASE_URL}/api/academic/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/academic/overview Status:", academicOverviewRes.status);

  const academicSubjectsRes = await fetch(`${BASE_URL}/api/academic/subjects`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/academic/subjects Status:", academicSubjectsRes.status);

  const academicCoursesRes = await fetch(`${BASE_URL}/api/academic/courses`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/academic/courses Status:", academicCoursesRes.status);

  // 8. Timetable Routes
  console.log("\n--- Testing Timetable Routes ---");
  const timetableOverviewRes = await fetch(`${BASE_URL}/api/timetable/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/timetable/overview Status:", timetableOverviewRes.status);

  const timetableSlotsRes = await fetch(`${BASE_URL}/api/timetable/slots`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/timetable/slots Status:", timetableSlotsRes.status);

  // 9. Attendance & Notifications
  console.log("\n--- Testing Attendance & Notifications ---");
  const attendanceReportRes = await fetch(`${BASE_URL}/api/attendance/report`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("GET /api/attendance/report Status:", attendanceReportRes.status);

  console.log("=== ALL QA TESTS COMPLETED ===");
}

runTests().catch(console.error);

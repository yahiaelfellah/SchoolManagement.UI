export default {
  common: {
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    select: "Select",
  },
  menu: {
    operations: "Operations",
    students: "Students",
    teachers: "Teachers",
    classes: "Classes",
    logout: "Logout",
  },
  dashboard: {
    title: "Dashboard",
  },
  login: {
    title: "School Dashboard Login",
    username: "Username",
    password: "Password",
    button: "Login",
    error: "Invalid username or password",
  },
  footer: {
    text: "School Management Dashboard ©{year} Created by You",
  },

  operations: {
    title: "Operations Center",
    new: "New",
    groups: {
      students: "Students",
      teachers: "Teachers",
      academics: "Academics",
      finance: "Finance & Payments",
      attendance: "Attendance",
      system: "System Administration",
    },
    students: {
      // Student Ops
      addStudent: {
        title: "Add Student",
        description: "Add a new student to the system",
        steps: {
          studentInfo: "Student Information",
          guardianInfo: "Parent / Guardian Information",
          paymentInfo: "Payment Information",
          additionalInfo: "Additional Information",
        },
        form: {
          firstName: "First Name",
          lastName: "Last Name",
          dateOfBirth: "Date of Birth",
          gender: "Gender",
          address: "Address",
          email: "Email Address",
          phone: "Phone Number",
          guardianFirstName: "Guardian First Name",
          guardianLastName: "Guardian Last Name",
          guardianPhoneNumber: "Guardian Phone Number",
          guardianRelation: "Relation to Student",
          tuitionPlan: "Tuition Plan",
          initialPayment: "Initial Payment",
          paymentMethod: "Payment Method",
          additionalNotes: "Additional Notes",
          medicalConditions: "Medical Conditions",
          emergencyContact: "Emergency Contact",
          allergies: "Allergies",
          specialNeeds: "Special Needs",
        },
      },
      enrollStudent: "Enroll Student",
      enrollStudent_desc: "Enroll a student in a class or program.",
      viewStudent: "View Student Details",
      viewStudent_desc: "View detailed information about a student.",
      uploadDocuments: "Upload Student Documents",
      uploadDocuments_desc: "Upload student-related documents and files.",
      promoteStudent: "Promote Student",
      promoteStudent_desc: "Promote a student to the next grade or level.",
      removeStudent: "Remove / Archive Student",
      removeStudent_desc:
        "Remove a student from the system or archive their records.",
    },

    // Student Ops

    // Teacher Ops
    addTeacher: "Add Teacher",
    addTeacher_desc: "Add a new teacher to the system.",
    assignTeacher: "Assign Teacher to Class",
    assignTeacher_desc: "Assign a teacher to classes or subjects.",
    updateTeacher: "Update Teacher Info",
    updateTeacher_desc: "Update teacher information or credentials.",
    viewTeacherPerformance: "View Teacher Performance",
    viewTeacherPerformance_desc:
      "View performance and evaluation reports for teachers.",

    // Academics
    addClass: "Add Class / Course",
    addClass_desc: "Create a new class or course in the academic system.",
    assignSubjects: "Assign Subjects to Teachers",
    assignSubjects_desc: "Assign subjects to classes or teachers.",
    setCalendar: "Set Academic Calendar",
    setCalendar_desc: "Configure the academic calendar and holidays.",
    generateTimetable: "Generate Timetable",
    generateTimetable_desc:
      "Generate timetable schedules for classes and teachers.",
    enterGrades: "Enter Grades",
    enterGrades_desc: "Enter or update student grades for subjects.",

    // Finance
    addPayment: "Add Payment Record",
    addPayment_desc: "Record a new payment from a student or guardian.",
    generateInvoice: "Generate Invoice",
    generateInvoice_desc: "Generate invoices for students or courses.",
    viewFinanceReports: "View Financial Reports",
    viewFinanceReports_desc:
      "View financial reports, summaries, and analytics.",
    exportFinanceData: "Export Finance Data",
    exportFinanceData_desc: "Export finance-related data to external formats.",

    // Attendance
    markAttendance: "Mark Attendance",
    markAttendance_desc: "Mark student attendance for a class or session.",
    viewAttendanceSummary: "View Attendance Summary",
    viewAttendanceSummary_desc:
      "View a summary of attendance for students or classes.",
    attendanceReport: "Generate Attendance Report",
    attendanceReport_desc: "Generate detailed attendance reports.",

    // System
    manageUsers: "Manage Users & Roles",
    manageUsers_desc: "Manage system users and access rights.",
    backupData: "Backup / Restore Data",
    backupData_desc:
      "Backup system data to prevent loss and restore when needed.",
    syncData: "Sync Data with Server",
    syncData_desc: "Synchronize system data with external sources.",
    sendNotifications: "Send Notifications",
    sendNotifications_desc: "Send notifications to users or groups.",
    manageLanguages: "Manage Languages / RTL",
    manageLanguages_desc:
      "Configure system languages and localization settings.",
  },
  students: {
    addStudentTitle: "Add Student",
    steps: {
      studentInfo: "Student Information",
      guardianInfo: "Parent / Guardian Information",
      paymentInfo: "Payment Information",
      additionalInfo: "Additional Information",
    },
  },
};

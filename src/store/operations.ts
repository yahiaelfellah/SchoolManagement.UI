// src/stores/useOperationsStore.ts
import { defineStore } from 'pinia'
import type OperationGroup from '@/model/operationGroup'
import {
  UserAddOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  ProfileOutlined,
  UploadOutlined,
  ArrowUpOutlined,
  UserDeleteOutlined,
  TeamOutlined,
  EditOutlined,
  BarChartOutlined,
  BookOutlined,
  BranchesOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  FileDoneOutlined,
  DollarOutlined,
  FileTextOutlined,
  PieChartOutlined,
  ExportOutlined,
  ClockCircleOutlined,
  TableOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CloudSyncOutlined,
  NotificationOutlined,
  GlobalOutlined,
} from '@ant-design/icons-vue'
import type FeatureState from '@/model/featureState'



export const useOperationsStore = defineStore('operations', {
  state: () => ({
    // ✅ All groups and operations (static metadata)
    operationGroups: [] as OperationGroup[],

    // ✅ Dynamic feature flags (could be fetched from backend)
    featureStates: [] as FeatureState[],
  }),

  getters: {
    // Returns the operation groups but applies feature flags dynamically
    evaluatedGroups: (state) => {
      return state.operationGroups.map(group => ({
        ...group,
        items: group.items.map(item => {
          const feature = state.featureStates.find(f => f.key === item.key)
          return {
            ...item,
            disabled: feature ? !feature.enabled : false,
            newFeature: feature ? feature.newFeature : false,
            description: item.description || '',
          }
        }),
      }))
    },
  },

  actions: {
    initializeOperations() {
      this.operationGroups = [
        {
          title: 'operations.groups.students',
          items: [
            { key: 'addStudent', title: 'operations.addStudent', description: 'operations.addStudent_desc', icon: UserAddOutlined, disabled: false, newFeature: false },
            { key: 'enrollStudent', title: 'operations.enrollStudent', description: 'operations.enrollStudent_desc', icon: SolutionOutlined, disabled: false, newFeature: false },
            { key: 'viewStudent', title: 'operations.viewStudent', description: 'operations.viewStudent_desc', icon: ProfileOutlined, disabled: false, newFeature: false },
            { key: 'uploadDocuments', title: 'operations.uploadDocuments', description: 'operations.uploadDocuments_desc', icon: UploadOutlined, disabled: false, newFeature: false },
            { key: 'promoteStudent', title: 'operations.promoteStudent', description: 'operations.promoteStudent_desc', icon: ArrowUpOutlined, disabled: false, newFeature: false },
            { key: 'removeStudent', title: 'operations.removeStudent', description: 'operations.removeStudent_desc', icon: UserDeleteOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.teachers',
          items: [
            { key: 'addTeacher', title: 'operations.addTeacher', description: 'operations.addTeacher_desc', icon: UsergroupAddOutlined, disabled: false, newFeature: false },
            { key: 'assignTeacher', title: 'operations.assignTeacher', description: 'operations.assignTeacher_desc', icon: TeamOutlined, disabled: false, newFeature: false },
            { key: 'updateTeacher', title: 'operations.updateTeacher', description: 'operations.updateTeacher_desc', icon: EditOutlined, disabled: false, newFeature: false },
            { key: 'viewTeacherPerformance', title: 'operations.viewTeacherPerformance', description: 'operations.viewTeacherPerformance_desc', icon: BarChartOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.academics',
          items: [
            { key: 'addClass', title: 'operations.addClass', description: 'operations.addClass_desc', icon: BookOutlined, disabled: false, newFeature: false },
            { key: 'assignSubjects', title: 'operations.assignSubjects', description: 'operations.assignSubjects_desc', icon: BranchesOutlined, disabled: false, newFeature: false },
            { key: 'setCalendar', title: 'operations.setCalendar', description: 'operations.setCalendar_desc', icon: CalendarOutlined, disabled: false, newFeature: false },
            { key: 'generateTimetable', title: 'operations.generateTimetable', description: 'operations.generateTimetable_desc', icon: ScheduleOutlined, disabled: false, newFeature: false },
            { key: 'enterGrades', title: 'operations.enterGrades', description: 'operations.enterGrades_desc', icon: FileDoneOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.finance',
          items: [
            { key: 'addPayment', title: 'operations.addPayment', description: 'operations.addPayment_desc', icon: DollarOutlined, disabled: false, newFeature: false },
            { key: 'generateInvoice', title: 'operations.generateInvoice', description: 'operations.generateInvoice_desc', icon: FileTextOutlined, disabled: false, newFeature: false },
            { key: 'viewFinanceReports', title: 'operations.viewFinanceReports', description: 'operations.viewFinanceReports_desc', icon: PieChartOutlined, disabled: false, newFeature: false },
            { key: 'exportFinanceData', title: 'operations.exportFinanceData', description: 'operations.exportFinanceData_desc', icon: ExportOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.attendance',
          items: [
            { key: 'markAttendance', title: 'operations.markAttendance', description: 'operations.markAttendance_desc', icon: ClockCircleOutlined, disabled: false, newFeature: false },
            { key: 'viewAttendanceSummary', title: 'operations.viewAttendanceSummary', description: 'operations.viewAttendanceSummary_desc', icon: TableOutlined, disabled: false, newFeature: false },
            { key: 'attendanceReport', title: 'operations.attendanceReport', description: 'operations.attendanceReport_desc', icon: BarChartOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.system',
          items: [
            { key: 'manageUsers', title: 'operations.manageUsers', description: 'operations.manageUsers_desc', icon: SettingOutlined, disabled: false, newFeature: false },
            { key: 'backupData', title: 'operations.backupData', description: 'operations.backupData_desc', icon: DatabaseOutlined, disabled: false, newFeature: false },
            { key: 'syncData', title: 'operations.syncData', description: 'operations.syncData_desc', icon: CloudSyncOutlined, disabled: false, newFeature: false },
            { key: 'sendNotifications', title: 'operations.sendNotifications', description: 'operations.sendNotifications_desc', icon: NotificationOutlined, disabled: false, newFeature: false },
            { key: 'manageLanguages', title: 'operations.manageLanguages', description: 'operations.manageLanguages_desc', icon: GlobalOutlined, disabled: false, newFeature: false },
          ],
        },
      ]
    },

    async fetchFeatureStates() {
      // Example: could come from API
      this.featureStates = [
        { key: 'addStudent', enabled: true, newFeature: true },
        { key: 'viewStudent', enabled: true, newFeature: false },
        { key: 'backupData', enabled: true, newFeature: true },
      ]
    },
  },
})

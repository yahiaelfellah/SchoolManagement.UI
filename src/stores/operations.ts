// src/stores/useOperationsStore.ts
import { defineStore } from 'pinia'
import type OperationGroup from '@/model/operationGroup'
import {
  UserAddOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  UploadOutlined,
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
  ClockCircleOutlined,
  TableOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'
import type FeatureState from '@/model/featureState'
import router from '@/router'



export const useOperationsStore = defineStore('operations', {
  state: () => ({
    operationGroups: [] as OperationGroup[],
    featureStates: [] as FeatureState[],
    lastOperationCategory : 0,
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
            { key: 'students/add', title: 'operations.students.add.title', description: 'operations.students.add.description', icon: UserAddOutlined, disabled: false, newFeature: false },
            { key: 'students/enroll', title: 'operations.students.enroll.title', description: 'operations.students.enroll.description', icon: SolutionOutlined, disabled: false, newFeature: false },
            { key: 'students/upload', title: 'operations.students.uploadDocuments.title', description: 'operations.students.uploadDocuments.description', icon: UploadOutlined, disabled: false, newFeature: false },
            { key: 'students/delete', title: 'operations.deleteOrArchive.title', description: 'operations.deleteOrArchive.description', icon: UserDeleteOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.teachers',
          items: [
            { key: 'teachers/add', title: 'operations.teachers.add.title', description: 'operations.teachers.add.description', icon: UsergroupAddOutlined, disabled: false, newFeature: false },
            { key: 'teachers/assign', title: 'operations.teachers.assignTeacher.title', description: 'operations.teachers.assignTeacher.description', icon: TeamOutlined, disabled: false, newFeature: false },
            { key: 'teachers/update', title: 'operations.teachers.update.title', description: 'operations.teachers.update.description', icon: EditOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.academics',
          items: [
            { key: 'academics/Addclasse', title: 'operations.academics.addClass.title', description: 'operations.academics.addClass.description', icon: BookOutlined, disabled: false, newFeature: false },
            { key: 'academics/AssignSubject', title: 'operations.academics.assignSubjects.title', description: 'operations.academics.assignSubjects.description', icon: BranchesOutlined, disabled: false, newFeature: false },
            { key: 'academics/generateTimetable', title: 'operations.academics.generateTimetable.title', description: 'operations.academics.generateTimetable.description', icon: ScheduleOutlined, disabled: false, newFeature: false },
          ],
        },
        {
          title: 'operations.groups.finance',
          items: [
            { key: 'finance/payment-ledger', title: 'operations.finance.paymentLedger.title', description: 'operations.finance.paymentLedger.description', icon: TableOutlined, disabled: false, newFeature: false },
            { key: 'finance/services', title: 'operations.finance.services.title', description: 'operations.finance.services.description', icon: AppstoreOutlined, disabled: false, newFeature: false },
            { key: 'finance/add', title: 'operations.finance.addPayment.title', description: 'operations.finance.addPayment.description', icon: DollarOutlined, disabled: false, newFeature: false },
            { key: 'finance/generate', title: 'operations.finance.generateInvoice.title', description: 'operations.finance.generateInvoice.description', icon: FileTextOutlined, disabled: false, newFeature: false },
              ],
        },
        // {
        //   title: 'operations.groups.attendance',
        //   items: [
        //     { key: 'markAttendance', title: 'operations.markAttendance.title', description: 'operations.markAttendance.description', icon: ClockCircleOutlined, disabled: false, newFeature: false },
        //     { key: 'viewAttendanceSummary', title: 'operations.viewAttendanceSummary.title', description: 'operations.viewAttendanceSummary.description', icon: TableOutlined, disabled: false, newFeature: false },
        //     { key: 'attendanceReport', title: 'operations.attendanceReport.title', description: 'operations.attendanceReport.description', icon: BarChartOutlined, disabled: false, newFeature: false },
        //   ],
        // }
      ]
    },

    fetchOperationsGroups(groupKey: string) {
      // For now, we initialize statically
      this.initializeOperations()
      return this.operationGroups.filter(g => g.title === `operations.groups.${groupKey}`)
    },
    async fetchFeatureStates() {
      // Example: could come from API
      this.featureStates = [
        { key: 'addStudent', enabled: true, newFeature: true },
        { key: 'viewStudent', enabled: true, newFeature: false },
        { key: 'backupData', enabled: true, newFeature: true },
      ]
    },

    navigateToOperation(key: string) {
      // Logic to navigate to the operation's route
      // Handle Finance routes differently
 if (key.startsWith('finance/')) {
  console.log('Navigating to finance route:', key)
        router.push({ path: `/${key}` })
      } else {
        router.push({ path: `/operations/${key}` })
      }
    }
  },
})

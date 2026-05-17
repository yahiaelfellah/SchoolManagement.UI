<template>
  <div class="system-operations">
    <a-page-header
      :title="t('operations.groups.system')"
      :sub-title="t('operations.manageUsers_desc')"
    />

    <a-card
      class="operation-section"
      :title="t('operations.manageUsers')"
    >
      <a-form
        :model="userForm"
        layout="vertical"
        @finish="handleAddUser"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              name="username"
              :label="tl('users.form.username')"
              :rules="[{ required: true, message: tl('users.validations.required') }]"
            >
              <a-input 
                v-model:value="userForm.username"
                :placeholder="tl('users.form.usernamePlaceholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              name="name"
              :label="tl('users.form.name')"
              :rules="[{ required: true, message: tl('users.validations.required') }]"
            >
              <a-input 
                v-model:value="userForm.name"
                :placeholder="tl('users.form.namePlaceholder')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              name="password"
              :label="tl('users.form.password')"
              :rules="[{ required: true, min: 6, message: tl('users.validations.passwordMin') }]"
            >
              <a-input-password 
                v-model:value="userForm.password"
                :placeholder="tl('users.form.passwordPlaceholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              name="role"
              :label="tl('users.form.role')"
              :rules="[{ required: true, message: tl('users.validations.required') }]"
            >
              <a-select
                v-model:value="userForm.role"
                :placeholder="tl('users.form.rolePlaceholder')"
              >
                <a-select-option 
                  v-for="role in Object.values(UserRoles)"
                  :key="role"
                  :value="role"
                >
                  {{ tl(`users.roles.${role}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
          >
            {{ t('common.create') }}
          </a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="userColumns"
        :data-source="users"
        :loading="loading"
        row-key="id"
      >
        <template #action="{ record }">
          <a-space>
            <a-switch
              v-model:checked="record.active"
              @change="(checked:any) => handleUserStatus(record.id, checked)"
            />
            <a-button
              type="link"
              danger
              @click="removeUser(record.id)"
            >
              {{ t('common.delete') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-card
      class="operation-section"
      :title="t('operations.backupData')"
    >
      <p>{{ t('operations.backupData_desc') }}</p>
      <a-button
        type="primary"
        :loading="backupLoading"
        @click="handleBackup"
      >
        {{ t('common.startBackup') }}
      </a-button>
    </a-card>

    <a-card
      class="operation-section"
      :title="t('operations.syncData')"
    >
      <p>{{ t('operations.syncData_desc') }}</p>
      <a-button
        type="primary"
        :loading="syncLoading"
        @click="handleSync"
      >
        {{ t('common.startSync') }}
      </a-button>
    </a-card>

    <!-- System Settings -->
    <a-card
      class="operation-section"
      :title="tl('systemSettings.title')"
    >
      <a-row
        :gutter="16"
        :align="'middle'"
      >
        <a-col :span="10">
          <div>{{ tl('systemSettings.registrationEnabled') }}</div>
        </a-col>
        <a-col :span="4">
          <a-switch
            v-model:checked="registrationEnabled"
            @change="updateSettings"
          />
        </a-col>
        <a-col :span="10">
          <div>{{ tl('systemSettings.maintenanceMode') }}</div>
        </a-col>
        <a-col :span="4">
          <a-switch
            v-model:checked="maintenanceMode"
            @change="updateSettings"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- Roles & Permissions -->
    <a-card
      class="operation-section"
      :title="tl('roles.title')"
    >
      <div style="margin-bottom:12px;">
        <a-button
          type="primary"
          @click="addRole"
        >
          {{ tl('roles.add') }}
        </a-button>
      </div>
      <a-list
        :data-source="rolesState"
        bordered
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
              <div>
                <strong>{{ item.name }}</strong>
                <div style="font-size:12px;color:var(--ant-gray-5);">
                  {{ item.permissions.join(', ') || tl('roles.noPermissions') }}
                </div>
              </div>
              <div>
                <a-button
                  type="link"
                  danger
                  @click="removeRole(item.name)"
                >
                  {{ t('common.delete') }}
                </a-button>
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <!-- Audit Logs -->
    <a-card
      class="operation-section"
      :title="tl('audit.title')"
    >
      <a-button
        class="mb-2"
        @click="reloadLogs"
      >
        {{ tl('audit.reload') }}
      </a-button>
      <a-table
        :data-source="mockLogs"
        :columns="auditColumns"
        row-key="id"
        :pagination="{ pageSize: 5 }"
      />
      <div
        v-if="!mockLogs.length"
        class="mt-2 text-gray-500"
      >
        {{ tl('audit.noLogs') }}
      </div>
    </a-card>

    <!-- Maintenance -->
    <a-card
      class="operation-section"
      :title="tl('maintenance.title')"
    >
      <a-space>
        <a-button @click="clearCache">
          {{ tl('maintenance.clearCache') }}
        </a-button>
        <a-button @click="runMigrations">
          {{ tl('maintenance.runMigrations') }}
        </a-button>
        <a-button @click="reindex">
          {{ tl('maintenance.reindex') }}
        </a-button>
      </a-space>
    </a-card>

    <!-- <a-card
      class="operation-section"
      :title="t('operations.manageLanguages')"
    >
      <p>{{ t('operations.manageLanguages_desc') }}</p>
      <a-select
        v-model:value="selectedLanguage"
        style="width: 200px"
        :options="languages"
        :placeholder="t('operations.manageLanguages_select')"
      />
      <a-button
        type="primary"
        class="ml-2"
        @click="handleLanguageChange"
      >
        {{ t('common.apply') }}
      </a-button>
    </a-card> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import { UserRoles, type User } from '@/model/user'

const { t, tl } = useLocalI18n('operations.systems')

// User management state
const loading = ref(false)
const users = ref<User[]>([])
const userForm = ref({
  username: '',
  name: '',
  password: '',
  role: 'user' // changed default to 'user'
})

const userColumns = [
  { title: tl('users.table.username'), dataIndex: 'username', key: 'username' },
  { title: tl('users.table.name'), dataIndex: 'name', key: 'name' },
  { title: tl('users.table.role'), dataIndex: 'role', key: 'role' },
  { title: tl('users.table.created'), dataIndex: 'createdAt', key: 'createdAt' },
  { title: tl('users.table.actions'), key: 'action', slots: { customRender: 'action' } }
]

// User management handlers
const handleAddUser = async () => {
  try {
    const newUser: User = {
      id: String(Date.now()),
      ...userForm.value,
      role: (userForm.value.role ?? 'user') as User['role'],
      active: true,
      createdAt: new Date()
    }
    users.value.push(newUser)
    message.success(tl('users.messages.created'))
    // Reset form
    userForm.value = {
      username: '',
      name: '',
      password: '',
      role: 'user'
    }
  } catch (error) {
    message.error(tl('users.messages.createError'))
  }
}

const handleUserStatus = (userId: string, active: boolean) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.active = active
    message.success(tl('users.messages.statusUpdated'))
  }
}

const removeUser = (userId: string) => {
  users.value = users.value.filter(u => u.id !== userId)
  message.success(tl('users.messages.deleted'))
}

const backupLoading = ref(false)
const syncLoading = ref(false)
const selectedLanguage = ref<string | null>(null)
const languages = [
  { label: 'English', value: 'en' },
  { label: 'Arabic', value: 'ar' },
  { label: 'French', value: 'fr' },
]

// System settings state & handlers
const registrationEnabled = ref(true)
const maintenanceMode = ref(false)
const updateSettings = () => {
  // In real app, send settings to server
  message.success(tl('systemSettings.updated'))
}

// Roles & Permissions state & handlers (simple mock)
const rolesState = ref<{ name: string; permissions: string[] }[]>([
  { name: 'admin', permissions: ['users:manage', 'system:configure'] },
  { name: 'staff', permissions: ['support:access'] },
  { name: 'user', permissions: [] } // changed: use 'user' instead of 'student'
])

const addRole = () => {
  const name = window.prompt(tl('roles.promptNewRole'))
  if (!name) return
  if (rolesState.value.find(r => r.name === name)) {
    message.error(tl('roles.exists'))
    return
  }
  rolesState.value.push({ name, permissions: [] })
  message.success(tl('roles.added'))
}

const removeRole = (name: string) => {
  rolesState.value = rolesState.value.filter(r => r.name !== name)
  message.success(tl('roles.removed'))
}

// Audit logs (mock)
const mockLogs = ref<{ id: number; when: string; message: string }[]>([
  { id: 1, when: new Date().toLocaleString(), message: 'Initial system setup' }
])
const auditColumns = [
  { title: tl('audit.columns.when'), dataIndex: 'when', key: 'when' },
  { title: tl('audit.columns.message'), dataIndex: 'message', key: 'message' }
]
const reloadLogs = () => {
  // Mock reload
  mockLogs.value.unshift({ id: Date.now(), when: new Date().toLocaleString(), message: tl('audit.logReloaded') })
  message.success(tl('audit.reloaded'))
}

// Maintenance handlers (mock)
const clearCache = async () => {
  message.loading(tl('maintenance.clearing'), 500)
  await new Promise(r => setTimeout(r, 700))
  message.success(tl('maintenance.done'))
}
const runMigrations = async () => {
  message.loading(tl('maintenance.migrationsRunning'), 500)
  await new Promise(r => setTimeout(r, 900))
  message.success(tl('maintenance.done'))
}
const reindex = async () => {
  message.loading(tl('maintenance.reindexing'), 500)
  await new Promise(r => setTimeout(r, 800))
  message.success(tl('maintenance.done'))
}

// Existing handlers for backup/sync
const handleBackup = async () => {
  backupLoading.value = true
  message.loading(t('operations.backupData_inProgress'))
  await new Promise(r => setTimeout(r, 1500))
  backupLoading.value = false
  message.success(t('operations.backupData_done'))
}

const handleSync = async () => {
  syncLoading.value = true
  message.loading(t('operations.syncData_inProgress'))
  await new Promise(r => setTimeout(r, 1200))
  syncLoading.value = false
  message.success(t('operations.syncData_done'))
}

const handleLanguageChange = () => {
  if (!selectedLanguage.value) return
  message.success(t('operations.manageLanguages_changed'))
}
</script>

<style scoped>
.system-operations {
  max-width: 60vw;
  margin: auto;
  padding: 20px;
}
.operation-section {
  margin-bottom: 24px;
}
.user-list {
  list-style: none;
  padding: 0;
  margin-top: 8px;
}
.user-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 4px 0;
}
</style>

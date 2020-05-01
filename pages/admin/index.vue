<template>
  <div>
    <h1>ADMIN AREA</h1>
    <template v-if="errors.length > 0">
      <v-alert v-for="(error, i) in errors" :key="i" type="error" dense>
        {{ error }}
      </v-alert>
    </template>

    <v-alert v-if="success" type="success" dense>
      Account saved
    </v-alert>

    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Username</th>
          <th class="text-left">Roles</th>
          <th class="text-left">Save</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <td>{{ account.id }}</td>
          <td>{{ account.username }}</td>
          <td>
            <v-combobox
              v-model="account.roles"
              :items="roles"
              multiple
            ></v-combobox>
          </td>
          <td>
            <v-btn text color="primary" @click="saveAccount(account)">
              Save
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let errors = []
    const { accounts } = await $axios
      .$get('/api/admin/accounts')
      .catch((error) => {
        errors = error.response.data.messages
      })

    return { errors, accounts }
  },
  data() {
    return {
      errors: [],
      roles: ['admin', 'artist'],
      success: false
    }
  },
  middleware: 'role/admin',
  methods: {
    async saveAccount(account) {
      this.errors = []
      this.success = false
      this.success = await this.$axios
        .$post('/api/admin/account', { account })
        .catch((error) => {
          this.errors = error.response.data.messages
        })
    }
  }
}
</script>

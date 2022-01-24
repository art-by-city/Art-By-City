<template>
  <v-dialog
    :value="open"
    persistent
    @click:outside="onCloseDialog"
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Register Username</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <!-- <v-form ref="form" v-model="valid" autocomplete="off">
                <v-text-field
                  v-model="asset.displayName"
                  type="text"
                  name="displayName"
                  label="Display Name"
                  counter="50"
                  :rules="[displayNameRules]"
                ></v-text-field>

                <v-textarea
                  v-model="asset.bio"
                  name="bio"
                  label="Bio"
                  rows="5"
                  counter="1024"
                  :rules="[bioRules]"
                ></v-textarea>
              </v-form> -->
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
                :loading="isUploading"
                @cancel="onCancel"
                @submit="onSubmit"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import TransactionDialog from '../common/TransactionDialog.component.vue'

@Component
export default class UsernameDialog extends TransactionDialog {
  /*
    Contract TX ID Xl7OC01HuzhQ2BMkBqKJ3AQ4sSlEDsuyOU2NEFch5Dc
    Initial State TX ID dHzWEn1sr-jGX6P5aY1VRT6BOva0p0FTMGNKyGQnsJQ
  */
}
</script>

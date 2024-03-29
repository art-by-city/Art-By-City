<template>
  <v-dialog
    :value="open"
    persistent
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Edit Profile</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                autocomplete="off"
                :disabled="isUploading || isSigned"
              >
                <v-text-field
                  v-model="asset.displayName"
                  type="text"
                  name="displayName"
                  label="Display Name"
                  counter="50"
                  :rules="[rules.displayName]"
                ></v-text-field>

                <v-textarea
                  v-model="asset.bio"
                  name="bio"
                  label="Bio"
                  rows="5"
                  counter="1024"
                  :rules="[rules.bio]"
                ></v-textarea>

                <v-text-field
                  v-model="asset.twitter"
                  name="twitter"
                  label="Twitter Username"
                  prepend-icon="mdi-twitter"
                  :rules="[rules.twitter]"
                ></v-text-field>

                <v-text-field
                  v-model="asset.instagram"
                  name="instagram"
                  label="Instagram Username"
                  prepend-icon="mdi-instagram"
                  :rules="[rules.instagram]"
                ></v-text-field>

                <v-text-field
                  v-model="asset.twitch"
                  name="twitch"
                  label="Twitch Username"
                  prepend-icon="mdi-twitch"
                  :rules="[rules.twitch]"
                ></v-text-field>

                <v-text-field
                  v-model="asset.soundcloud"
                  name="soundcloud"
                  label="SoundCloud Username"
                  prepend-icon="mdi-soundcloud"
                  :rules="[rules.soundcloud]"
                ></v-text-field>

                <v-text-field
                  v-model="asset.linkedin"
                  name="linkedin"
                  label="LinkedIn Username"
                  prepend-icon="mdi-linkedin"
                  :rules="[rules.linkedin]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
                :loading="isUploading"
                :signed="isSigned"
                :txTotal="txTotal"
                @sign="onSign"
                @submit="onSubmit"
                @cancel="onCancel"
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

import { DomainEntityCategory, Profile } from '~/app/core'
import {
  twitter,
  twitch,
  instagram,
  soundcloud,
  linkedin,
  maxLength
} from '~/app/util/rules'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class EditProfileDialog extends TransactionDialog<Profile> {
  asset: Profile = {}
  type: DomainEntityCategory = 'profile'
  valid = false
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }

  get rules() {
    return {
      twitter,
      twitch,
      instagram,
      soundcloud,
      linkedin,
      displayName: maxLength(50),
      bio: maxLength(1024)
    }
  }

  fetchOnServer = false
  async fetch() {
    if (this.$auth.user && this.$auth.user.address) {
      const profile = await this.$profileService.fetchProfile(
        this.$auth.user.address
      )

      if (profile) {
        this.asset = profile
      }
    }
  }

  created() {
    this.$nuxt.$on('profile-CONFIRMED', () => { this.$fetch() })
  }

  async onSign() {
    this.valid = this.$refs.form.validate()

    if (this.asset && this.valid) {
      this.isUploading = true

      if (this.asset.twitter && this.asset.twitter[0] === '@') {
        this.asset.twitter = this.asset.twitter.substring(1)
      }

      this.transaction = await this.$profileService.createProfileTransaction(
        this.asset
      )

      this.isSigned = await this.$arweaveService.sign(this.transaction)

      this.isUploading = false
    }
  }

  close() {
    this.baseClose()
  }
}
</script>

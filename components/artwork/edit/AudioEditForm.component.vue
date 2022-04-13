<template>
  <v-container class="audio-edit-form">
    <v-form
      ref="form"
      v-model="valid"
      autocomplete="off"
      :disabled="isUploading || isSigned"
    >
      <v-row dense justify="center">
        <template v-if="artwork.audio.url">
          <audio controls :src="artwork.audio.url" />
        </template>
        <template v-else>
          <label
            class="audio-upload-label"
            for="upload"
          >
            <v-icon>mdi-music-note-plus</v-icon>
          </label>
          <input
            id="upload"
            class="audio-upload-input"
            type="file"
            :accept="accept"
            @input="onAudioChanged($event)"
          />
        </template>
      </v-row>
      <v-row dense justify="center">
        <ImageInput
          v-model="artwork.image"
          :valid="!hasImageValidationErrors"
          :disabled="isUploading || isSigned"
          :max="1"
        />
      </v-row>
      <v-row dense justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="artwork.title"
            type="text"
            name="artworkTitle"
            label="Title"
            counter="128"
            @input="generateSlugFromTitle"
            :rules="[rules.required, rules.maxLength(128)]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.slug"
            type="text"
            name="artworkSlug"
            counter="128"
            :label="slugBase"
            :rules="[rules.required, rules.maxLength(128), rules.slug]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.created"
            name="artworkCreated"
            label="Created (Year)"
            placeholder="2022"
            :rules="[rules.year]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.city"
            name="artworkCity"
            label="City Code"
            placeholder="NYC"
            :rules="[rules.city]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.genre"
            type="text"
            name="genre"
            label="Genre"
            counter="240"
            placeholder="e.g. Rock, Hip-Hop, Blues, EDM"
            :rules="[rules.maxLength(240)]"
          ></v-text-field>

          <v-textarea
            v-model="artwork.description"
            name="artworkDescription"
            label="Description"
            hint="Enter a description for this Audio"
            auto-grow
            rows="2"
            counter="1024"
            :rules="[rules.maxLength(1024)]"
          ></v-textarea>

          <LicenseSelector v-model="artwork.license" />
        </v-col>
      </v-row>
      <v-row dense>
        <div class="text-caption">
          Note: Audio will have streamable version generated in AAC 256kb.
        </div>
        <div class="text-caption">
          Note: Images will have JPEG thumbnail previews generated in 1080p and
          4k resolutions but will not exceed source image dimensions.
        </div>
      </v-row>
      <v-row dense justify="center">
        <TransactionFormControls
          :loading="isUploading"
          :signed="isSigned"
          :txTotal="txTotal"
          :txSize="txSize"
          :info="info"
          :pct="uploadPct"
          @sign="onSign"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { PublishingForm } from '~/components/publishing'
import {
  ImageInput,
  LicenseSelector,
  TransactionFormControls
} from '~/components/forms'
import { AudioArtworkCreationOptions } from '~/app/core/artwork/audio'
import { uuidv4 } from '~/app/util'

@Component({
  components: {
    ImageInput,
    LicenseSelector,
    TransactionFormControls
  }
})
export default class AudioEditForm extends PublishingForm {
  readonly accept =
    'audio/aac,audio/flac,audio/mpeg,audio/wav,audio/ogg,audio/webm'

  artwork: AudioArtworkCreationOptions = {
    creator: this.$auth.user?.address || '',
    title: '',
    slug: '',
    image: { guid: uuidv4(), url: '', type: '' },
    audio: { guid: uuidv4(), url: '', type: '' }
  }

  rules = {
    required: (value: string = '') => value.length < 1 ? 'Required' : true,
    minLength: (minLength: number) => (value: string = '') => {
      if (!value) {
        return true
      }
      return value.length < minLength
        ? `Minimum 3 characters`
        : true
    },
    maxLength: (maxLength: number) => (value: string = '') => {
      return value.length > maxLength
        ? `Maximum ${maxLength} characters`
        : true
    },
    city: (value: string = '') => {
      if (!value) {
        return true
      }

      const validCityCodeRegex = /^[a-zA-Z]{3}$/

      if (!validCityCodeRegex.test(value)) {
        return 'Must be a valid city code'
      }

      return true
    },
    year: (value: string = '') => {
      if (!value) {
        return true
      }

      const year = Number.parseInt(value)

      if (
        Number.isNaN(year)
        || year > (new Date()).getFullYear()
        || year < 1000
      ) {
        return 'Must be a valid year'
      }

      return true
    },
    slug: (value: string = '') => {
      const validSlugRegex = /^[a-z0-9]+(?:[-_\.]*[a-z0-9]+)*$/

      if (!validSlugRegex.test(value)) {
        return 'Must be a valid URL slug'
          + ' (lowerchase alphanumerics, hyphen, underscore, period),'
          + ' must not end with a hyphen, underscore, or period'
      }

      return true
    }
  }

  get slugBase(): string {
    const username = this.$auth.user.username || this.artwork.creator

    return `artby.city/${username}/`
  }

  get hasImageValidationErrors(): boolean {
    return this.dirty && !this.artwork.image.url
  }

  get hasAudioValidationErrors(): boolean {
    return this.dirty && !this.artwork.audio.url
  }

  async onAudioChanged(event: InputEvent) {
    if (event.target) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const audio = target.files[0]
        this.artwork.audio = {
          guid: uuidv4(),
          type: audio.type,
          url: URL.createObjectURL(audio)
        }
        await this.suggestMetadataFromFile(audio)
      }
    }
  }

  private generateSlugFromTitle(title: string) {
    this.artwork.slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s]/g, '-')
      .replace(/[^a-z0-9_\-\.]/g, '')
  }

  private async suggestMetadataFromFile(file: File) {
    this.artwork.title = file.name.slice(0, file.name.lastIndexOf('.'))
    this.generateSlugFromTitle(this.artwork.title)
  }

  async onSign() {
    this.dirty = true
    this.valid = this.$refs.form.validate()

    if (this.valid) {
      this.isUploading = true
      this.info = 'Building Artwork transaction...'
      let processedCount = 0
      this.uploadPct = 0
      this.transaction = await this.$artworkService.createArtworkTransaction(
        this.artwork,
        (progress?: number) => {
          console.log('PROGRESS', progress)
          if (typeof progress === 'number') {
            this.info = 'Encoding streamable audio...'
            processedCount = progress + 1
          } else {
            processedCount = 1
          }

          this.uploadPct = 100 * (processedCount) / 2
        }
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction, true)

      this.info = ''
      this.uploadPct = null
      this.isUploading = false
    }
  }

  async onSubmit() {
    if (this.isSigned && this.transaction) {
      this.isUploading = true
      this.onUploading(true)
      this.uploadPct = 0
      this.$txQueueService.submitUserTransaction(
        this.transaction,
        {
          id: this.transaction.id,
          last_tx: this.transaction.last_tx,
          type: 'artwork',
          status: 'PENDING_SUBMISSION',
          created: new Date().getTime()
        },
        (err?: Error) => {
          this.info = ''
          this.uploadPct = null
          this.onUploading(false)
          if (err) {
            console.error('Error submitting user tx', err)
            this.$toasts.error('Error submitting user tx: ' + err.message)
            this.isUploading = false
          } else {
            return this.save()
          }
        },
        true,
        (pctComplete: number) => {
          this.info = `Uploading transaction...`
          this.uploadPct = pctComplete
        }
      )
    }
  }
}
</script>

<style scoped>
/* .audio-upload-button {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
} */
.audio-upload-button.v-text-field {
  margin-top: 0px;
  display: inline-flex;
  align-items: center;
  padding: 2px;
}
.audio-upload-button >>> .v-input__control {
  display: none;
}
.audio-upload-button >>> .v-input__prepend-outer {
  margin-right: 0px;
  margin-left: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.audio-upload-label {
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: inline-flex;
}
.audio-upload-input {
  display: none;
}
</style>

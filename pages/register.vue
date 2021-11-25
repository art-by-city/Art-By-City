<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <span class="text-h2">Artist Pre-Registration Program</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" sm="5">
        <p class="text-body-1">
          If you're unfamiliar with Arweave, Web 3.0, decentralized applications
          (dApps), or blockchain technology you can fill out the form below and
          we'll get in touch to help you get started on your Web 3.0 journey.
          Meanwhile, check out our <strong>Art By City</strong>
          <a
            class="text-decoration-none"
            href="https://discord.gg/SsHHQGSKTB"
            target="_blank"
          >
            Community Discord
            <v-icon small dense style="margin-top: -3px;">
              mdi-open-in-new
            </v-icon>
          </a>
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" sm="6">
        <v-stepper v-model="signUpStep" vertical flat non-linear>

          <!-- Form Step 1 -->
          <v-stepper-step
            step="1"
            editable
            :rules="[() => fields.email.valid]"
            @click="focusFormField('emailField')"
          >
            Email Address
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-sheet flat tile class="pt-1">

              <!-- Email -->
              <v-form
                ref="emailForm"
                v-model="fields.email.valid"
                @submit.prevent="
                  validateForm('emailForm')
                  && focusFormField('step1Continue')
                "
              >
                <v-text-field
                  v-model="fields.email.value"
                  ref="emailField"
                  outlined
                  label="Email"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-form>
            </v-sheet>
            <v-btn
              ref="step1Continue"
              elevation="2"
              outlined
              class="mx-auto mb-2"
              @click="
                fields.email.valid
                && signUpStep++
                && focusFormField('nameField')
              "
            >
              Continue
            </v-btn>
            <small>
              press <strong>Enter</strong><v-icon>mdi-keyboard-return</v-icon>
            </small>
          </v-stepper-content>

          <!-- Form Step 2 -->
          <v-stepper-step
            step="2"
            editable
            :rules="[
              () => fields.name.valid
                && fields.arweaveAddress.valid
                && fields.discordHandle.valid
                && fields.location.valid
            ]"
            @click="focusFormField('nameField')"
          >
            Identity
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-sheet flat tile class="pt-1">

              <!-- Name -->
              <v-form
                ref="nameForm"
                v-model="fields.name.valid"
                @submit.prevent="
                  validateForm('nameForm')
                  && focusFormField('arweaveAddressField')
                "
              >
                <v-text-field
                  ref="nameField"
                  v-model="fields.name.value"
                  outlined
                  label="Name (optional)"
                  counter="120"
                  :rules="[rules.count(120)]"
                ></v-text-field>
              </v-form>

              <!-- Arweave Address -->
              <v-form
                ref="arweaveAddressForm"
                v-model="fields.arweaveAddress.valid"
                @submit.prevent="
                  validateForm('arweaveAddressForm')
                  && focusFormField('discordHandleField')
                "
              >
                <v-text-field
                  ref="arweaveAddressField"
                  v-model="fields.arweaveAddress.value"
                  outlined
                  label="Arweave Address (optional)"
                  :rules="[rules.arweaveAddress]"
                ></v-text-field>
              </v-form>

              <!-- Discord Handle -->
              <v-form
                ref="discordHandleForm"
                v-model="fields.discordHandle.valid"
                @submit.prevent="
                  validateForm('discordHandleForm')
                  && focusFormField('locationField')
                "
              >
                <v-text-field
                  ref="discordHandleField"
                  v-model="fields.discordHandle.value"
                  outlined
                  label="Discord Handle (optional)"
                  placeholder="username#1234"
                  :rules="[rules.discordHandle]"
                ></v-text-field>
              </v-form>

              <!-- Location -->
              <v-form
                ref="locationForm"
                v-model="fields.location.valid"
                @submit.prevent="
                  validateForm('locationForm')
                  && focusFormField('step2Continue')
                "
              >
                <v-text-field
                  ref="locationField"
                  v-model="fields.location.value"
                  outlined
                  label="Location (optional)"
                  counter="120"
                  :rules="[rules.count(120)]"
                ></v-text-field>
              </v-form>
            </v-sheet>
            <v-btn
              ref="step2Continue"
              elevation="2"
              outlined
              class="mx-auto mb-2"
              @click="
                fields.name.valid
                && fields.arweaveAddress.valid
                && fields.discordHandle.valid
                && fields.location.valid
                && signUpStep++
                && focusFormField('artistTypeField')
              "
            >
              Continue
            </v-btn>
            <small>
              press <strong>Enter</strong><v-icon>mdi-keyboard-return</v-icon>
            </small>
          </v-stepper-content>

          <!-- Form Step 3 -->
          <v-stepper-step
            step="3"
            editable
            :rules="[
              () => fields.artistType.valid
                && fields.artistMedium.valid
                && fields.artistLinks.valid
            ]"
            @click="focusFormField('artistTypeField')"
          >
            Your Art
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-sheet flat tile class="pt-1">

              <!-- Type of Artist -->
              <v-form
                ref="artistTypeForm"
                @submit.prevent="
                  validateForm('artistTypeForm')
                  && focusFormField('artistMediumField')
                "
              >
                <v-text-field
                  ref="artistTypeField"
                  v-model="fields.artistType.value"
                  outlined
                  label="Type of Artist (painter, sculptor, photographer, musician, etc.)"
                  counter="240"
                  :rules="[rules.count(240)]"
                ></v-text-field>
              </v-form>

              <!-- Artist Medium -->
              <v-form
                ref="artistMediumForm"
                @submit.prevent="
                  validateForm('artistMediumForm')
                  && focusFormField('artistLinksField')
                "
              >
                <v-text-field
                  ref="artistMediumField"
                  v-model="fields.artistMedium.value"
                  outlined
                  label="Type of Art Medium/Media (oil paint, photographs, clay, audio, mixed-media, etc.)"
                  counter="240"
                  :rules="[rules.count(240)]"
                ></v-text-field>
              </v-form>

              <!-- Artist Links -->
              <v-form
                ref="artistLinksForm"
                @submit.prevent="
                  validateForm('artistLinksForm')
                  && focusFormField('step3Continue')
                "
              >
                <v-textarea
                  ref="artistLinksField"
                  v-model="fields.artistLinks.value"
                  outlined
                  label="Links to art example (one per line, optional)"
                  counter="500"
                  :rules="[rules.count(500)]"
                  auto-grow
                ></v-textarea>
              </v-form>
            </v-sheet>
            <v-btn
              ref="step3Continue"
              elevation="2"
              outlined
              class="mx-auto mb-2"
              @click="
                fields.artistType.valid
                && fields.artistMedium.valid
                && fields.artistLinks.valid
                && signUpStep++
                && focusFormField('preferredUsernameField')
              "
            >
              Continue
            </v-btn>
            <small>
              press <strong>Enter</strong><v-icon>mdi-keyboard-return</v-icon>
            </small>
          </v-stepper-content>

          <!-- Form Step 4 -->
          <v-stepper-step
            step="4"
            editable
            :rules="[() => fields.preferredUsername.valid]"
            @click="focusFormField('preferredUsernameField')"
          >
            Preferred Username
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-sheet flat tile class="pt-1">
              <p>
                As <strong>Art By City</strong> is a decentralized application,
                we will be deploying a Smart Contract to facilitate username
                registration and profile routing.  Use the field below to let us
                know what your preferred username is and we can pre-register it
                before the contract is deployed on Arweave Mainnet.
              </p>

              <!-- Preferred Username -->
              <v-form
                ref="preferredUsernameForm"
                @submit.prevent="
                  validateForm('preferredUsernameForm')
                  && focusFormField('step4Continue')
                "
              >
                <v-text-field
                  ref="preferredUsernameField"
                  v-model="fields.preferredUsername.value"
                  outlined
                  label="Preferred Username"
                  counter="32"
                  :rules="[rules.count(32)]"
                ></v-text-field>
              </v-form>
            </v-sheet>
            <v-btn
              ref="step4Continue"
              elevation="2"
              outlined
              class="mx-auto mb-2"
              @click="
                fields.preferredUsername.valid
                && signUpStep++
                && focusFormField('howDidYouHearAboutUsField')
              "
            >
              Continue
            </v-btn>
            <small>
              press <strong>Enter</strong><v-icon>mdi-keyboard-return</v-icon>
            </small>
          </v-stepper-content>

          <!-- Form Step 5 -->
          <v-stepper-step
            step="5"
            editable
            :rules="[
              () => fields.howDidYouHearAboutUs.valid
                && fields.referral.valid
            ]"
            @click="focusFormField('howDidYouHearAboutUsField')"
          >
            Referral
          </v-stepper-step>
          <v-stepper-content step="5">
            <v-sheet flat tile class="pt-1">

              <!-- How Did You Hear About Us? -->
              <v-form
                ref="howDidYouHearAboutUsForm"
                @submit.prevent="
                  validateForm('howDidYouHearAboutUsForm')
                  && focusFormField('referralField')
                "
              >
                <v-text-field
                  ref="howDidYouHearAboutUsField"
                  v-model="fields.howDidYouHearAboutUs.value"
                  outlined
                  label="How did you hear about us? (optional)"
                  counter="240"
                  :rules="[rules.count(240)]"
                ></v-text-field>
              </v-form>

              <!-- Referral -->
              <v-form
                ref="referralForm"
                @submit.prevent="
                  validateForm('referralForm')
                  && focusFormField('step5Continue')
                "
              >
                <v-text-field
                  ref="referralField"
                  v-model="fields.referral.value"
                  outlined
                  label="Did anyone refer you? (optional)"
                  counter="120"
                  :rules="[rules.count(120)]"
                ></v-text-field>
              </v-form>
            </v-sheet>

            <v-btn
              ref="step5Continue"
              elevation="2"
              outlined
              class="mx-auto mb-2"
              @click="
                fields.howDidYouHearAboutUs.valid
                && fields.referral.valid
                && signUpStep++
                && focusFormField('submit')
              "
            >
              Continue
            </v-btn>
            <small>
              press <strong>Enter</strong><v-icon>mdi-keyboard-return</v-icon>
            </small>
          </v-stepper-content>

          <!-- Form Step 6 -->
          <v-stepper-step step="6" editable>Review &amp; Submit</v-stepper-step>
          <v-stepper-content step="6">
            <v-sheet flat tile class="pt-1">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(item, name) in fields" :key="name">
                      <td>{{ item.label }}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

              <v-btn
                ref="submit"
                elevation="2"
                outlined
                class="mx-auto mb-2"
                @click="submit()"
                :loading="submitting"
              >
                Submit
              </v-btn>
            </v-sheet>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { EMAIL_REGEX, debounce } from '~/helpers'

type VForm = Vue & {
  reset: () => void
  resetValidation: () => void
  validate: () => boolean
}

@Component
export default class RegisterPage extends Vue {
  signUpStep: number = 1
  submitting: boolean = false

  // Form Fields
  fields: { [key: string]: { label: string, value: string, valid: boolean } } = {
    email: { label: 'Email', value: '', valid: true },
    name: { label: 'Name', value: '', valid: true },
    arweaveAddress: { label: 'Arweave Address', value: '', valid: true },
    discordHandle: { label: 'Discord Handle', value: '', valid: true },
    location: { label: 'Location', value: '', valid: true },
    artistType: { label: 'Artist Type', value: '', valid: true },
    artistMedium: { label: 'Artist Medium', value: '', valid: true },
    artistLinks: { label: 'Artist Links', value: '', valid: true },
    preferredUsername: { label: 'Preferred Username', value: '', valid: true },
    howDidYouHearAboutUs: { label: 'How did you hear about us?', value: '', valid: true },
    referral: { label: 'Referred By', value: '', valid: true },
  }

  // Form Validation Rules
  rules = {
    required: (value: string) => !!value || 'Required',
    email: (value: string) => EMAIL_REGEX.test(value) || 'Invalid Email',
    count: (limit: number) => (value: string) => {
      return value.length <= limit || `Max ${limit} characters`
    },
    arweaveAddress: (value: string) => {
      return !value || /^(0x)?[a-z0-9_-]{43}$/i.test(value) || 'Invalid Arweave Address'
    },
    discordHandle: (value: string) => {
      return !value || /^[a-z0-9_]{2,32}#[0-9]{4}$/i.test(value) || 'Invalid Discord Handle'
    },
    username: (value: string) => {
      return /^[a-z0-9_]$/i.test(value) || 'Invalid Username'
    }
  }

  validateForm(formRefName: string): boolean {
    try {
      const formRef = (this.$refs[formRefName] as VForm)

      return formRef.validate()
    } catch (err) {}

    return true
  }

  focusFormField(refName: string) {
    try {
      const ref = (this.$refs[refName] as Vue)
      const el = (ref.$el as HTMLElement)
      console.log(refName, el.tagName)
      if (el.tagName === 'BUTTON') {
        el.focus()
      } else {
        const tags = ['input', 'textarea']
        for (const n in tags) {
          let matchingChild = el.getElementsByTagName(tags[n]).item(0)
          if (matchingChild) {
            (matchingChild as HTMLElement).focus()
          }
        }
      }
    } catch (err) {}
  }

  @debounce
  async submit() {
    const valid = this.validateForm('emailForm')
      && this.validateForm('nameForm')
      && this.validateForm('arweaveAddressForm')
      && this.validateForm('discordHandleForm')
      && this.validateForm('locationForm')
      && this.validateForm('artistTypeForm')
      && this.validateForm('artistMediumForm')
      && this.validateForm('artistLinksForm')
      && this.validateForm('preferredUsernameForm')
      && this.validateForm('howDidYouHearAboutUsForm')
      && this.validateForm('referralForm')

    if (valid) {
      this.submitting = true

      const submission: any = {}
      for (const key in this.fields) {
        if (this.fields[key].value) {
          submission[key] = this.fields[key].value
        }
      }

      // TODO -> submit

      this.submitting = false
    }
  }
}
</script>

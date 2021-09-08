<template>
  <div>
    <HeroSection
      @click="onHeroCallToActionClicked"
      @scroll="onHeroScrollClicked"
    />

    <section id="yourArtForever">
      <v-container fluid>
        <v-row dense justify="center">
          <v-col cols="auto">
            <p class="text-h2">
              your art
              <span class="font-weight-black text-uppercase text-h1">
                forever
              </span>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="permanentStorage" class="mx-auto my-16">
      <v-container fluid>
        <v-row>
          <v-col cols="4" offset="2">
            <span class="text-h2 font-weight-bold">
              Welcome to the Artist's Permaweb
            </span>
          </v-col>
          <v-col cols="4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              fermentum neque et sodales rutrum. Mauris lobortis aliquet
              commodo. Vestibulum eget lacus in erat luctus pellentesque vel
              eget lectus.
            </p>
            <v-btn
              outlined
              x-large
              elevation="2"
              @click="onPublishNowClicked"
            >
              PUBLISH NOW
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="monetization" class="mx-auto my-16">
      <v-container fluid>
        <v-row>
          <v-col cols="4" offset="2">
            <span class="text-h2 font-weight-bold">
              Turn-key Monetization
            </span>
          </v-col>
          <v-col cols="4">
            <p>
              Quisque gravida, tortor nec ullamcorper fringilla, urna enim
              suscipit magna, sed fringilla magna ipsum nec erat. Phasellus
              eros mi, suscipit sed consequat at, efficitur a dolor. Duis
              venenatis, libero at porta laoreet, arcu sem sollicitudin sem,
              vitae lobortis mi eros vitae ex.
            </p>
            <v-btn
              outlined
              x-large
              elevation="2"
              @click="onStartMonetizingClicked"
            >
              START MONETIZING
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="verification" class="mx-auto my-16">
      <v-container fluid>
        <v-row>
          <v-col cols="4" offset="2">
            <span class="text-h2 font-weight-bold">
              Verified Art &amp; Artists
            </span>
          </v-col>
          <v-col cols="4">
            <p>
              Integer eget urna odio. Proin blandit elit ante, a aliquam lorem
              porta et. Vivamus posuere cursus mi ac semper. Vestibulum eu
              sapien vel dui commodo consectetur accumsan sollicitudin libero.
              Fusce viverra augue sed est posuere luctus. Integer cursus
              faucibus tellus, at egestas est faucibus quis.
            </p>
            <v-btn
              outlined
              x-large
              elevation="2"
              @click="onGetVerifiedClicked"
            >
              GET VERIFIED
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'
import HeroSection from '~/components/pitch/HeroSection.component.vue'

@Component({
  components: {
    HeroSection
  }
})
export default class HomePage extends Vue {
  onHeroScrollClicked() {
    this.$vuetify.goTo('#yourArtForever')
  }

  onHeroCallToActionClicked() {
    this.checkAuthAndNavToPublish()
  }

  @debounce
  onPublishNowClicked() {
    this.checkAuthAndNavToPublish()
  }

  @debounce
  onStartMonetizingClicked() {
    this.checkAuthAndNavToPublish()
  }

  @debounce
  onGetVerifiedClicked() {
    this.$router.push('/register')
  }

  private checkAuthAndNavToPublish() {
    this.$nuxt.$emit('needs-auth', () => {
      this.$router.push('/publish')
    })
  }
}
</script>

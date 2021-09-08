<template>
  <v-parallax
    class="hero-parallax mb-16"
    :src="heroImage.src"
    height="1000"
  >
    <v-row class="dark" align="center" justify="center">
      <v-col cols="12">
        <SplashLogo />
      </v-col>
      <v-col cols="12">
        <div class="ml-16 mt-n16 pa-12">
          <div class="text-h5 font-weight-bold">{{ heroImage.title }}</div>
          <div class="font-weight-thin font-italic">
            {{ heroImage.artist }}
          </div>
          <div>{{ heroImage.year }}</div>
        </div>
      </v-col>
      <v-btn
        fab
        outlined
        icon
        dark
        @click="onCallToActionClicked"
        class="mt-n16"
      >
        <v-icon>mdi-chevron-double-down</v-icon>
      </v-btn>
    </v-row>
  </v-parallax>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'nuxt-property-decorator'
import _ from 'lodash'

import { debounce } from '~/helpers'
import SplashLogo from '~/components/common/SplashLogo.component.vue'

@Component({
  components: {
    SplashLogo
  }
})
export default class HeroSection extends Vue {
  @debounce
  @Emit('click') onCallToActionClicked() {}

  images = [
    {
      artist: 'Daliah Ammar',
      title: 'Edge of Town',
      year: 2020,
      link: '',
      src: 'gallery-images/dalia-1.jpg'
    },
    {
      artist: 'Daliah Ammar',
      title: 'Hanna',
      year: 2020,
      link: '',
      src: 'gallery-images/dalia-2.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'Earth Mother',
      year: 2020,
      link: '',
      src: 'gallery-images/harryhukkinen-1.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'Styrofoam Series #7',
      year: 2009,
      link: '',
      src: 'gallery-images/harryhukkinen-2.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'Sculpture',
      year: 2020,
      link: '',
      src: 'gallery-images/harryhukkinen-3.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'High Rust - Wheelbarrows',
      description: 'Steel, Concrete 35"W x 28"H x 5\'L',
      year: 2012,
      link: '',
      src: 'gallery-images/harryhukkinen-4.jpg'
    },
    {
      artist: 'Christian M',
      title: 'Pablo',
      year: 2020,
      link: '',
      src: 'gallery-images/christian_m-1.jpg'
    },
    {
      artist: 'Christian M',
      title: 'Trippy Rainbow House',
      year: 2020,
      link: '',
      src: 'gallery-images/christian_m-2.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-1.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-2.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-3.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-4.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-5.jpg'
    },
    {
      artist: 'JP Hackett',
      title: '',
      year: 2020,
      link: '',
      src: 'gallery-images/jp-6.jpg'
    }
  ]

  currentImageIndex: number = 0
  get heroImage() {
    return this.images[this.currentImageIndex]
  }

  created() {
    this.images = _.shuffle(this.images)
    this.rotateHeroImage()
  }

  private rotateHeroImage() {
    setTimeout(() => {
      const nextIndex = this.currentImageIndex + 1
      if (nextIndex < this.images.length) {
        this.currentImageIndex = nextIndex
      } else {
        this.currentImageIndex = 0
      }
      this.rotateHeroImage()
    }, 10000, this)
  }
}
</script>

<style scoped>
.hero-parallax >>> .v-parallax__content {
  background-color: rgba(0, 0, 0, 0.333);
}
.hero-parallax >>> .v-parallax__image {
  animation: slowlyzoom 60s linear infinite;
}
@-moz-keyframes slowlyzoom {
  50%  { -moz-transform: scale(1.1) translate(-50%); }
  100% { -moz-transform: scale(1)   translate(-50%); }
}
@-webkit-keyframes slowlyzoom {
  50%  { -webkit-transform: scale(1.1) translate(-50%); }
  100% { -webkit-transform: scale(1)   translate(-50%); }
}
@keyframes slowlyzoom {
  50%  { transform: scale(1.1) translate(-50%); }
  100% { transform: scale(1)   translate(-50%); }
}
</style>

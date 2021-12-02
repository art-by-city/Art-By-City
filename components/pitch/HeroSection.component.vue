<template>
  <v-img
    class="hero-splash mb-16"
    content-class="hero-splash-content"
    dark
    transition="fade-transition"
    :src="heroImage.src"
    height="1000"
  >
    <v-container fluid>
      <v-row justify="center" class="my-16">
        <v-col cols="12">
          <SplashLogo />
        </v-col>
      </v-row>
      <v-row class="my-16">
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <div class="ml-16 pa-12">
            <div class="text-h5 font-weight-bold">{{ heroImage.title }}</div>
            <div class="font-weight-thin font-italic">
              {{ heroImage.artist }}
            </div>
            <div>{{ heroImage.year }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" class="my-16">
        <v-col cols="auto">
          <v-btn
            fab
            outlined
            icon
            dark
            @click="onScrollDownClicked"
          >
            <v-icon>mdi-chevron-double-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
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

  @debounce
  @Emit('scroll') onScrollDownClicked() {}

  images = [
    {
      artist: 'Daliah Ammar',
      title: 'Edge of Town',
      year: 2020,
      src: 'gallery-images/dalia-1.jpg'
    },
    {
      artist: 'Daliah Ammar',
      title: 'Hanna',
      year: 2020,
      src: 'gallery-images/dalia-2.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'Earth Mother',
      year: 2020,
      src: 'gallery-images/harryhukkinen-1.jpg'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'Styrofoam Series #4',
      year: 2009,
      src: 'gallery-images/harryhukkinen-2.png'
    },
    {
      artist: 'Harry Hukkinen',
      title: 'High Rust - Wheelbarrows',
      year: 2012,
      src: 'gallery-images/harryhukkinen-3.jpg'
    },
    {
      artist: 'Christian M',
      title: 'Pablo',
      year: 2020,
      src: 'gallery-images/christian_m-1.jpg'
    },
    {
      artist: 'Christian M',
      title: 'Trippy Rainbow House',
      year: 2020,
      src: 'gallery-images/christian_m-2.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Collage 1',
      year: 2020,
      src: 'gallery-images/jp-1.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Collage 2',
      year: 2020,
      src: 'gallery-images/jp-2.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Collage 3',
      year: 2020,
      src: 'gallery-images/jp-3.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Teeth',
      year: 2020,
      src: 'gallery-images/jp-4.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Ink 1',
      year: 2020,
      src: 'gallery-images/jp-5.jpg'
    },
    {
      artist: 'JP Hackett',
      title: 'Ink 2',
      year: 2020,
      src: 'gallery-images/jp-6.jpg'
    },
    // {
    //   artist: 'Higgs Boson',
    //   title: 'Decoherence',
    //   year: 2018,
    //   src: 'gallery-images/Decoherence_1.JPG'
    // },
    // {
    //   artist: 'Higgs Boson',
    //   title: 'Rhizome',
    //   year: 2013,
    //   src: 'gallery-images/Rhizome_1.JPG'
    // }
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
.hero-splash >>> .v-responsive__content {
  /* background-color: rgba(0, 0, 0, 0.333); */
}
.hero-splash >>> .hero-splash-content {
  background-color: rgba(0, 0, 0, 0.333);
}
.hero-splash >>> .v-image__image.v-image__image--cover {
  animation: slowlyzoom 60s linear infinite;
}
@-moz-keyframes slowlyzoom {
  50%  { -moz-transform: scale(1.1) }
  100% { -moz-transform: scale(1)   }
}
@-webkit-keyframes slowlyzoom {
  50%  { -webkit-transform: scale(1.1) }
  100% { -webkit-transform: scale(1)   }
}
@keyframes slowlyzoom {
  50%  { transform: scale(1.1) }
  100% { transform: scale(1)   }
}
</style>

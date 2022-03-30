<template>
  <v-container fluid class="pa-0" style="width: 100%;">
    <v-row justify="center" align="center">
      <v-col
        cols="12"
        class="text-h2 font-weight-bold text-center mt-10"
      >
        <strong>The Artist's Permaweb</strong>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <section id="tagline" class="my-12">
          <p class="text-h4">
            <b>Art By City</b> is a
            <b>decentralized artist community &amp; protocol</b>
          </p>
        </section>

        <section id="about" class="my-12">
          <p>
            <b>Art By City</b> is first and foremost an artist community
            <a
              class="black--text"
              href="https://en.wikipedia.org/wiki/Decentralized_autonomous_organization"
              target="_blank"
            >DAO</a>.
            More specifically, <b>Art By City</b> is a
            <a
              class="black--text"
              href="https://www.arweave.org/profit-sharing-communitie"
              target="_blank"
            >Profit Sharing Community</a>
            or PSC. The <b>Art By City</b> community governs development of the
            <b>Art By City</b> protocol, dApps, and tools artists will need to
            take control of their
            <a
              class="black--text"
              href="https://en.wikipedia.org/wiki/Web3"
              target="_blank"
            >Web3</a>
            experience.
          </p>
          <p>
            The main <b>Art By City</b>
            <a
              class="black--text"
              href="https://en.wikipedia.org/wiki/Decentralized_application"
              target="_blank"
            >dApp</a>
            (<a class="black--text" href="/">artby.city</a>) serves as the primary
            portal with which artists, collectors, and enthusiasts can interact
            with the <b>Art By City</b> community and protocol by publishing art,
            participating in the direction of development, and receiving
            engagement rewards through the <b>Art By City</b> Profit Sharing
            Token.
          </p>
        </section>

        <section id="team" class="my-12">
          <v-row justify="center">
            <v-col cols="12" class="text-h4 font-weight-bold text-center">
              The Team
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col
              v-for="({ name, title, address }, i) in team"
              :key="i"
              cols="auto"
            >
              <v-card flat>
                <UserAvatar :user="{ address }" />
                <v-card-title>{{ name }}</v-card-title>
                <v-card-subtitle>{{ title }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <section id="journey" class="my-12">
          <v-row justify="center">
            <v-col cols="12" class="text-h4 font-weight-bold text-center">
              The Journey
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <p>
                Mike and Jim started <b>Art By city</b> as a
                <a
                  class="black--text"
                  href="https://en.wikipedia.org/wiki/Web_2.0"
                  target="_blank"
                >Web 2.0</a>
                platform for artists with a focus on community, collaboration,
                and discoverability.
              </p>
              <p>
                After speaking with many artists, Mike and Jim realized they
                were primarily focused on minting NFTs so they started to
                research the best way to implement them, focusing on the artist
                experience only to find the current ecosystem severely lacking
                in numerous areas.
              </p>
              <p>
                Since they decided that
                <a
                  class="black--text"
                  href="https://arweave.org"
                  target="_blank"
                >Arweave</a>
                was the best blockchain for artists to store their artwork, Mike
                and Jim brought Slava on board and participated in Arweave's
                <a
                  class="black--text"
                  href="https://owf.dev"
                  target="_blank"
                >Open Web Foundry</a>,
                throwing out all of the centralized Web 2.0 code and starting
                over with a focus on open source, transparency, and
                decentralization.
              </p>
            </v-col>
          </v-row>
        </section>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <section id="owf-presentation" class="mb-12">
          <iframe
            class="d-block mx-auto"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/tL_LFaurxRg"
            title="YouTube video player"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture
            "
            allowfullscreen
          ></iframe>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class AboutPage extends Vue {
  team = [
    {
      name: 'Jim',
      title: 'CEO & Co-founder',
      address: '36Ar8VmyC7YS7JGaep9ca2ANjLABETTpxSeA7WOV45Y'
    },
    {
      name: 'Mike',
      title: 'Co-founder',
      address: 'mike'
    },
    {
      name: 'Slava',
      title: 'COO',
      address: 'x3GW6wfBZ3wHTflETInuzJ5rOv_6JvlFi-dl6yYAr8Y'
    },
    {
      name: 'dabit',
      title: 'CFO',
      address: 'LtILfPM8agd7RU6AaQmwh0SFEvxPu-tb06E_iHksvUM'
    }
  ]
}
</script>

<style scoped>
.top-banner >>> .v-parallax__content {
  background-color: rgba(0, 0, 0, 0.333);
}
</style>

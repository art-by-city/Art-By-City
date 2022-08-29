<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-h2 text-center">
        <strong>FAQ</strong>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="6">
        <v-expansion-panels multiple flat accordion>
          <template v-for="(faq, i) in this.faqs">
            <a
              v-if="faq.header"
              :key="i"
              :id="faq.id"
              :href="`#${faq.id}`"
              class="
                text-h5
                font-weight-bold
                faq-header
                text-decoration-none
                black--text
              "
            >
              {{ faq.header }}
            </a>
            <v-expansion-panel v-else :key="i">
              <v-expansion-panel-header :id="faq.id" class="text-h6">
                {{ faq.q }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p v-html="faq.a"></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </template>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class FaqPage extends Vue {
  faqs = [
    { id: 'general', header: 'General' },
    {
      id: 'what-is-art-by-city',
      q: 'What is Art By City?',
      a: `
        <p>
          Art By City is a Web3 Art Curation Protocol & Artist Community
          ${this.link(
            'DAO',
            'https://en.wikipedia.org/wiki/Decentralized_autonomous_organization'
          )}.
          More specifically, Art By City is a type of DAO called a
          ${this.link(
            'Profit Sharing Community',
            'https://www.arweave.org/profit-sharing-communities',
          )}
          or PSC.
        </p>
        <p>
          The <b>Art By City</b> DAO governs the <b>Art By City</b>
          protocol, which artists, collectors, and enthusiasts can interact with
          to publish art permanently, monetize their publications, and support
          artists.
        </p>
      `
    },
    {
      id: 'what-is-this-website',
      q: 'What is this website? (artby.city)',
      a: `
        <p>
          This website, ${this.link('artby.city', '/')}, serves as the flagship
          ${this.link(
            'dApp',
            'https://en.wikipedia.org/wiki/Decentralized_application'
          )}
          with which users can interact with the <b>Art By City</b> DAO and
          protocol.
        </p>
        <p>
          <b>Art By City</b>'s goals for this dApp are to support artists in
          ${this.link('Web3', 'https://en.wikipedia.org/wiki/Web3')} by focusing
          on discoverability, facilitating artist relationships, and providing a
          <i>personal gallery experience</i> for artists, collectors, and fans.
        </p>
        <p>
          Since the <b>Art By City</b> protocol is open and decentralized,
          anyone can interact with it on their own website if they want to.
        </p>
      `
    },
    {
      id: 'how-do-i-log-in',
      q: 'How do I log in to artby.city?',
      a: `
        <p>
          Since ${this.link('artby.city', '/')} is a
          ${this.link(
            'Decentralized Application',
            'https://en.wikipedia.org/wiki/Decentralized_application'
          )},
          the only way to authenticate is with an Arweave wallet.
        </p>
        <p>
          If you're familiar with blockchain technology, you can head over to
          ${this.link('artby.city/wallete', '/wallet')} to create an Arweave
          wallet.
        </p>
        <p>
          If you're new to blockchain technology, feel free to reach out to us
          on the ${this.artByCityDiscord} and we'll help you get started.
        </p>
      `
    },
    { id: 'arweave-wallet', header: 'Arweave Wallet' },
    {
      id: 'how-do-i-create-arweave-wallet',
      q: 'How do I get an Arweave Wallet?',
      a: `Head over to ${this.link('artby.city/wallet', '/wallet')}`
    },
    {
      id: 'how-do-i-backup-wallet',
      q: 'How do I back up my Arweave Wallet?',
      a: `
        It is <b>strongly encouraged</b> that you back up your Arweave Wallet
        keyfile. This keyfile <i>is</i> your wallet and should be kept safe.
        <b>Do not give anyone</b> your keyfile and <b>do not lose</b> your
        keyfile, as you will lose access to your account. Since Art By City is
        decentralized, we have no access to your wallet or keyfile and we
        cannot recover it for you.
      `
    },
    { id: 'publishing', header: 'Publishing' },
    {
      id: 'how-do-i-publish',
      q: 'How do I publish on Art By City?',
      a: `
        <ol>
          <li>
            Log in with your Arweave Wallet by clicking "log in" at the
            top of the page
          </li>
          <li>
            Choose the file(s) you'd like to publish and fill out the rest of
            the fields to your liking
          </li>
          <li>
            Once published, it will take some time for the Arweave blockchain
            to confirm the publication
          </li>
          <li>
            Once confirmed, your artwork will be permanently published and
            available on your profile!
          </li>
        </ol>
      `
    },
    {
      id: 'how-much-does-publishing-cost',
      q: 'How much does it cost to publish my artwork permanently?',
      a: `
        <ul>
          <li>Cost depends on the data size of your publication</li>
          <li>
            When publishing, you will see an up-to-date cost estimate in both
            AR and USD
          </li>
          <li>
            You can also check the current price of data storage on Arweave at
            ${this.link('arweavefees.com', 'https://arweavefees.com')}
          </li>
          <li>
            As of time of writing, the cost of storing 1 MB <b>permantly</b>
            on Arweave is < $0.01 USD
          </li>
        </ul>
      `
    },
    {
      id: 'how-can-i-share-my-publication',
      q: 'How can I share my publication?',
      a: `
        <ul>
          <li>
            Copy the URL of your publication to share with others or link on
            social platforms
          </li>
          <li>
            <b>Art By City</b> provides
            ${this.link('Open Graph Protocol', 'https://ogp.me')}
            meta tags for your publication, so most of the time all that is
            needed is to paste the link in your social media post
          <li>
            The
            ${this.link(
              'URL slug',
              'https://en.wikipedia.org/wiki/Clean_URL#Slug'
            )}
            of your publication will be based off of the publication\'s title.
            You can always customize the URL slug to your
            liking at publication time.
          </li>
        </ul>
      `
    },
    { id: 'monetization', header: 'Monetization' },
    {
      id: 'how-can-i-monetize-my-publication',
      q: 'How can I monetize my publication?',
      a: `
        <ul>
          <li>How you monetize your publications is completely up to you</li>
          <li>
            Once the <b>Art By City</b> DAO contract is launched, all users will
            automatically participate in monetization and profit-sharing by
            engaging with the <b>Art By City</b> protocol
          </li>
          <li>Currently, users can:
            <ul>
              <li><b>Tip</b> you directly</li>
              <li>
                <b>Like</b> your publications, which also includes a
                customizable <b>Tip</b>
              </li>
            </ul>
          </li>
          <li>
            Additionally, you can choose to monetize your publications through:
            <ul>
              <li>selling digital or physical prints</li>
              <li>licensing out or selling rights to your artwork</li>
              <li>
                ${this.link(
                  'minting them as NFTs',
                  '#can-i-mint-nfts',
                  false
                )}
              </li>
              <li>
                or any other means you can think of
              </li>
            </ul>
          </li>
          <li>
            Feel free to reach out to us on the ${this.artByCityDiscord} and
            we'll work towards supporting your preferred monetization channel.
          </li>
       </ul>
      `
    },
    {
      id: 'can-i-mint-nfts',
      q: 'Can I mint NFTs from my publication?',
      a: `
        <p>
          This feature is actively being worked on.  Stay tuned for updates!
        </p>
        <p>
          If you're interested in minting NFTs from your publications before
          this feature is generally available, reach out to us on the
          ${this.artByCityDiscord} and we'll help you out. (Feel free to @
          jim or slava!)
        </p>
      `
    },
    {
      id: 'where-can-i-mint',
      q: 'Where can I mint NFTs from my publication?',
      a: `
        <p>
          When it comes to NFTs, <b>Art By City</b> takes a blockchain-agnostic
          approach. It is up to you which blockchain, platform, and collection
          you use to mint an NFT from your publication.
        </p>
        <p>
          Feel free to reach out to us on the ${this.artByCityDiscord} and we
          can explore the best options for you.
        </p>
      `
    },
    { id: 'code', header: 'Code' },
    {
      id: 'open-source',
      q: 'Can I see your source code?',
      a: `
        <p>
          <b>
            ${this.link('All of it, always.', 'https://gitlab.com/art-by-city')}
          </b>
          We wouldn't have it any other way.
        </p>
        <p>
          We publish our source code as it is written and our primary repository
          is on ${this.link('GitLab', 'https://gitlab.com/art-by-city')},
          mirrored regularly to
          ${this.link('GitHub', 'https://github.com/art-by-city')}.
        </p>
        <p>
          In the future, all of our code will be published to Arweave.
        </p>
      `
    },
    { id: 'misc', header: 'Misc' },
    {
      id: 'missing-faq',
      q: 'Can I suggest something for this FAQ?',
      a: `Absolutely!  Reach out to us on the ${this.artByCityDiscord}`
    }
  ]

  get artByCityDiscord() {
    return this.link(
      '<b>Art By City</b> Discord',
      'https://discord.gg/w4Yhc95b8p'
    )
  }

  link(text: string, href: string, newTab: boolean = true) {
    return `<a class="black--text" href="${href}"`
      + (newTab ? 'target="_blank"' : '')
      + `>${text}</a>`
  }
}
</script>

<style scoped>
.faq-header {
  width: 100%;
}
</style>

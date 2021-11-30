<template>
  <div class="notifications-menu">
    <v-menu
      offset-y
      fixed
      left
      tile
      :value="open"
      max-height="80vh"
      min-width="400"
      content-class="notifications-menu"
      @input="onMenuOpened"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon tile x-large v-on="on" v-bind="attrs">
          <v-badge
            color="primary"
            :content="humanReadableUnreadCount"
            overlap
            bottom
            :value="unread.length > 0"
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list dense max-width="400px">
        <v-row class="ma-2">
          <v-col cols="auto">
            <span class="text-h5">My Notifications</span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <!-- <v-btn small outlined elevation="2" to="/transactions">
              View All
            </v-btn> -->
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <template v-for="(notif, i) in notifs">
          <v-lazy transition="fade-transition">
            <NotificationComponent
              :key="notif.guid"
              :notification="notif"
              :showUnread="i <= lastUnreadCount - 1"
            />
          </v-lazy>
          <v-divider v-if="i !== notifs.length - 1"></v-divider>
        </template>
      </v-list>
    </v-menu>

    <v-menu
      offset-y
      tile
      fixed
      left
      :value="popupNotifs.length"
      max-height="300"
      min-width="400"
      content-class="notifications-popup-container"
      transition="fade"
    >
      <template v-slot:activator="{ on, attrs }"><div></div></template>
      <v-list dense max-width="400px" class="transparent-background">
        <template v-for="(notif, i) in popupNotifs">
          <v-lazy transition="fade-transition" class="white-background">
            <NotificationComponent
              :key="notif.guid"
              :notification="notif"
            />
          </v-lazy>
          <v-divider v-if="i !== popupNotifs.length - 1"></v-divider>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { Notification } from '~/models'
import NotificationComponent
  from '~/components/notifications/Notification.component.vue'
import {
  ADD_NOTIFICATION,
  MARK_NOTIFICATIONS_READ
} from '~/store/notifications/mutations'
import { debounce } from '~/helpers'

@Component({
  components: {
    NotificationComponent
  }
})
export default class NotificationsMenu extends Vue {
  open: boolean = false
  popupNotifs: Notification[] = []
  popupTimeouts: number[] = []
  lastUnreadCount: number = 0
  lastUnreadTimeout?: number

  get notifs(): Notification[] {
    return this.$accessor.notifications.list
  }

  get unread(): Notification[] {
    return this.$accessor.notifications.listUnread
  }

  get humanReadableUnreadCount(): string {
    if (this.unread.length > 99) {
      return '99+'
    }

    return this.unread.length.toString()
  }

  created() {
    this.$store.subscribe((mutation, _state) => {
      if (mutation.type === `notifications/${ADD_NOTIFICATION}`) {
        this.popupNotifs.push(mutation.payload)
        this.popupTimeouts.push(setTimeout(() => {
          const idx = this.popupNotifs.findIndex(
            (pn) => pn.guid === mutation.payload.guid
          )
          this.popupNotifs.splice(idx, 1)
        }, 10000, this))
      }
    })
  }

  destroyed() {
    this.popupTimeouts.forEach(clearTimeout)
    clearTimeout(this.lastUnreadTimeout)
  }

  @debounce
  onMenuOpened() {
    this.lastUnreadCount = this.unread.length

    this.$accessor.notifications[MARK_NOTIFICATIONS_READ]({
      readtime: new Date().getTime()
    })

    this.lastUnreadTimeout = setTimeout(() => {
      this.lastUnreadCount = 0
    }, 10000, this)
  }
}
</script>

<style scoped>
.transparent-background {
  background-color: rgba(0, 0, 0, 0);
}

.white-background {
  background-color: white;
}
</style>

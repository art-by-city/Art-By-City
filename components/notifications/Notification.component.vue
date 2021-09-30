<template>
  <v-list-item class="notification" dense three-line>
    <v-list-item-avatar tile left size="24" class="overflow-visible">
      <v-badge
        color="primary"
        transition="fade"
        overlap
        left
        dot
        icon="mdi-exclamation-thick"
        :value="!this.notification.read || showUnread"
      >
        <v-img
          contain
          max-width="24px"
          src="/icons/transfer.svg"
        />
      </v-badge>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        class="text-body-1 font-weight-regular notification-message"
        v-html="notification.message"
      > </v-list-item-title>
      <v-list-item-subtitle v-if="notification.txId">
        {{ notification.txId }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <DateWithTooltip :date="notification.timestamp" />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Notification } from '~/models'

@Component
export default class NotificationComponent extends Vue {
  @Prop({ type: Object, required: true }) notification!: Notification

  @Prop({ type: Boolean, required: false }) showUnread?: boolean
}
</script>

<style scoped>
.notification-message {
  white-space: normal;
}

.overflow-visible {
  overflow: visible;
}
</style>

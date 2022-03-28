<template>
  <v-card
    :to="`/${user.username}`"
    class="artist-tag"
    :class="{ 'dark': dark }"
    width="150"
    flat
    outlined
  >
    <div class="artist-tag-hole"></div>
    <v-card-actions>
      <v-list-item>
        <v-list-item-avatar>
          <UserAvatar :user="user" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.username }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { User } from '~/app/core/user'

@Component
export default class ArtistTag extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly user!: User

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined
}
</script>

<style scoped>
.artist-tag {
  border-width: 2px;
  border-top-left-radius: 4px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  display: inline-block;
}
.artist-tag >>> .v-card__actions {
  padding: 0;
  margin-left: 5px;
}
.artist-tag-hole {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 5px;
  left: 5px;
  border-color: rgba(0, 0, 0, 0.12);
  border-style: solid;
  border-width: 2px;
  border-radius: 5px !important;
}
.dark .artist-tag-hole {
  border-color: rgba(255, 255, 255, 0.12)
}
</style>

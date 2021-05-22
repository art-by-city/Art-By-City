<template>
  <div class="artwork-edit-controls">
    <v-card
      v-if="isOwnerOrAdmin"
      class="artwork-edit-controls"
      tile
      elevation="5"
    >
      <v-navigation-drawer
        permanent
        expand-on-hover
      >
        <v-list nav dense>
          <v-list-item
            dense
          >
            <v-list-item-action>
              <v-icon color="primary">
                {{ 'mdi-arrow-expand-right' }}
              </v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon :color="published ? 'green' : 'grey'">
                {{ published ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ published ? 'published' : 'unpublished' }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon :color="approved ? 'green' : 'grey'">
                mdi-stamper
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ approved ? 'approved' : 'unapproved' }}
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-if="!editMode && isOwner"
            dense
            @click="onEditClicked"
          >
            <v-list-item-action>
              <v-icon color="primary">mdi-square-edit-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>edit</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="editMode && isOwner"
            dense
            @click="onSaveClicked"
          >
            <v-list-item-action>
              <v-icon color="primary">mdi-content-save</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>save</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="editMode && isOwner"
            dense
            @click="onCancelClicked"
          >
            <v-list-item-action>
              <v-icon color="warning">mdi-cancel</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>cancel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="!editMode && isOwnerOrAdmin"
            dense
            @click="onPublishClicked"
          >
            <v-list-item-action>
              <v-icon color="primary">mdi-eye</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ published ? 'unpublish' : 'publish' }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="!editMode && isAdmin"
            dense
            @click="onApproveClicked"
          >
            <v-list-item-action>
              <v-icon color="primary">mdi-stamper</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ approved ? 'unapprove' : 'approve' }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="editMode && isOwner && !isNew"
            dense
            @click="onDeleteClicked"
          >
            <v-list-item-action>
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'nuxt-property-decorator'

@Component
export default class ArtworkEditControls extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isOwner!: boolean
  @Prop({ type: Boolean, default: false }) readonly isAdmin!: boolean
  @Prop({ type: Boolean, default: false }) readonly isNew!: boolean

  @Prop({ type: Boolean, default: false }) editMode!: boolean

  @Prop({ type: Boolean, required: true }) published!: boolean
  @Prop({ type: Boolean, required: true }) approved!: boolean

  @Prop({ type: Boolean, default: true }) collapsed!: boolean

  get isOwnerOrAdmin() {
    return this.isOwner || this.isAdmin
  }

  @Emit('edit') onEditClicked() {}
  @Emit('save') onSaveClicked() {}
  @Emit('cancel') onCancelClicked() {}
  @Emit('delete') onDeleteClicked() {}
  @Emit('publish') onPublishClicked() {}
  @Emit('approve') onApproveClicked() {}
}
</script>

<style scoped>
.artwork-edit-controls {
  position: fixed;
  top: 40vh;
  left: 0px;
  z-index: 5555;
}
</style>

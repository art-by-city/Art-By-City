<template>
  <v-card
    v-if="isOwnerOrAdmin"
    class="artwork-actions"
    tile
    elevation="5"
  >
    <v-list dense min-width="150px">
      <v-list-item>
        <v-list-item-content>
          <v-checkbox
            v-model="published"
            disabled
            label="published"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-checkbox
            v-model="approved"
            disabled
            label="approved"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!editMode && isOwner">
        <v-list-item-content>
          <v-btn small color="primary" @click="onEditClicked">Edit</v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="editMode && isOwner">
        <v-list-item-content>
          <v-btn small color="primary" @click="onSaveClicked">Save</v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="editMode && isOwner">
        <v-list-item-content>
          <v-btn small color="warning" @click="onCancelClicked">Cancel</v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!editMode && isOwnerOrAdmin">
        <v-list-item-content>
          <v-btn small color="primary" @click="onPublishClicked">
            {{ published ? 'Unpublish' : 'Publish' }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!editMode && isAdmin">
        <v-list-item-content>
          <v-btn small color="primary" @click="onApproveClicked">
            {{ approved ? 'Unapprove' : 'Approve' }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="editMode && isOwner">
        <v-list-item-content>
          <v-btn small color="error" @click="onDeleteClicked">Delete</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'

@Component
export default class ArtworkEditControls extends Vue {
  @Prop({ type: Boolean, default: false }) readonly isOwner!: boolean
  @Prop({ type: Boolean, default: false }) readonly isAdmin!: boolean

  @Prop({ type: Boolean, default: false }) editMode!: boolean

  @Prop({ type: Boolean, required: true }) published!: boolean
  @Prop({ type: Boolean, required: true }) approved!: boolean

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
.artwork-actions {
  position: fixed;
  top: 40vh;
  left: 5px;
}
</style>

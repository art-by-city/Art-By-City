export default interface Invitation {
  id: string
  created: Date
  updated: Date
  createdByUser: any // TODO -> use front end model
  sent: boolean
  sentOn: Date
  sentToEmail: string
}

export interface NavItem {
  icon: string
  title: string
  to: string
  only?: string[]
  disabled?: boolean
}

export interface Breadcrumb {
  text: string | number
  href: string
  disabled?: boolean
  to?: string | object
  exact?: boolean
  link?: boolean
}

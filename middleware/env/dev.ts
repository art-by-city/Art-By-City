export default ({ redirect }: { $auth: any; redirect: any }) => {
  if (
    process.env.NODE_ENV !== 'production'
    && process.env.NODE_ENV !== 'staging'
  ) {
    return true
  }

  return redirect('/')
}

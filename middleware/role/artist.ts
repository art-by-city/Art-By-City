export default ({ $auth, redirect }: { $auth: any; redirect: any }) => {
  if (
    $auth.user &&
    $auth.user.roles &&
    ($auth.user.roles || []).includes('artist')
  ) {
    return true
  }

  return redirect('/')
}

import ArLocal from '@textury/arlocal'

(async () => {
  const arLocal = new ArLocal(1984, true)

  // Start is a Promise, we need to start it inside an async function.
  await arLocal.start()

  // Your tests here...

  // After we are done with our tests, let's close the connection.
  // await arLocal.stop();
})()

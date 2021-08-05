const ArLocal = require('@textury/arlocal');

(async () => {
  const arLocal = new ArLocal.default(1984, false);

  // Start is a Promise, we need to start it inside an async function.
  await arLocal.start();

  // Your tests here...

  // After we are done with our tests, let's close the connection.
  // await arLocal.stop();
})();

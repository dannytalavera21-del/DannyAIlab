const app = require('./app');
const environment = require('./config/environment');

const port = environment.port;

app.listen(port, () => {
  console.log(`Olive Rentals listening on port ${port}`);
});

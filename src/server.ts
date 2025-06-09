import app from './app';
import config from './config/config';

console.log('hi from Api Gateway');

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


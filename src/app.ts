import express from 'express';
import { Request, Response } from 'express';
import { proxyRoute } from './routes/proxy';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
const app = express();


app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(['/auth', '/user'], express.json());
app.use(
  morgan(
    'combined',
  ),
);

app.use(rateLimit({ windowMs: 60_000, max: 100, limit: 100 }));
app.use('/auth', proxyRoute['/auth']);
app.use('/user', proxyRoute['/user']);
app.get('/', (req: Request, res: Response) => {
  console.log('hi');
  res.send('Hi from server');
});

export default app;

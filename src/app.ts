import express from 'express';
import { Request, Response } from 'express';
import { proxyRoute } from './routes/proxy';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate';
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(['/public/auth', '/public/user','/public/content','/private/content'], express.json());
app.use(morgan('combined'));

app.use(rateLimit({ windowMs: 60_000, max: 100, limit: 100 }));

app.use('/public/auth', proxyRoute['/public/auth']);
app.use('/public/user', proxyRoute['/public/user']);
app.use('/public/content', proxyRoute['/public/content']);

app.use('/private/auth', authenticate, proxyRoute['/private/auth']);
app.use('/private/user', authenticate, proxyRoute['/private/user']);
app.use('/private/content', authenticate, proxyRoute['/private/content']);

app.all('/protected-route', authenticate, (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'You have access' });
});

app.get('/', (req: Request, res: Response) => {
  console.log('hi');
  res.send('Hi from server');
});

export default app;

import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { services } from '../config/services';
import bodyParser from 'body-parser';

const TIMEOUT = 30 * 60 * 1000;
const jsonBodyParser = bodyParser.json();
const urlencodedBodyParser = bodyParser.urlencoded({ extended: true });

const createProxy = (target: string) => {
  return [
    jsonBodyParser,
    urlencodedBodyParser,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      proxyTimeout: TIMEOUT,
      on: {
        proxyReq: fixRequestBody,
        proxyRes: (proxyRes, req, res) => {
          const cookies = proxyRes.headers['set-cookie'];
          if (cookies) {
            res.setHeader('Set-Cookie', cookies); // forward cookies to client
            console.log(`[PROXY] Set-Cookie: ${cookies}`);
          }
          console.log(
            `[PROXY] ${req.method} ${req.url} -> ${proxyRes.statusCode}`,
          );
        },
        error: (err) => {
          console.error('[PROXY ERROR]', err);
        },
      },
    }),
  ];
};

// export const proxyRoute = {
//   '/auth': createProxy(services.auth),
//   '/user': createProxy(services.user),
// };

export const proxyRoute = {
  '/public/auth': createProxy(services.auth),
  '/private/auth': createProxy(services.auth),
  '/public/user': createProxy(services.user),
  '/private/user': createProxy(services.user),
  '/public/content': createProxy(services.content),
  '/private/content': createProxy(services.content),
};

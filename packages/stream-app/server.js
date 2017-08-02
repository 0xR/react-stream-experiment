import Koa from 'koa';
import React from 'react';
import { renderToStream } from 'react-dom/node-stream';

const app = new Koa();

app.use(ctx => {
  ctx.body = renderToStream(<h1>hello!</h1>);
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});

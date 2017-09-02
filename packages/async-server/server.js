import Koa from 'koa';
import React from 'react';
import { renderToString, renderToStream } from 'react-dom/server';
import App from 'react-redux-realworld-example-app';

const app = new Koa();

app.use(ctx => {
  if (ctx.url === '/async') {
    ctx.type = '.html';
    ctx.body = renderToStream(App);
  } else if (ctx.url === '/sync') {
    ctx.body = renderToString(App);
  }
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});

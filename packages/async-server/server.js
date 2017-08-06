import Koa from 'koa';
import React from 'react';
import { renderToString, renderToStream } from 'react-dom/server';

import { makePage } from 'view';

const app = new Koa();
const Page = makePage(React);

app.use(ctx => {
  if (ctx.url === '/async') {
    ctx.type = '.html';
    ctx.body = renderToStream(<Page />);
  } else if (ctx.url === '/sync') {
    ctx.body = renderToString(<Page />);
  }
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});

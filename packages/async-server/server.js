import Koa from 'koa';
import React from 'react';
import { renderToStream } from 'react-dom/node-stream';

import newPage from 'view/Page';

const app = new Koa();
const Page = newPage(React);

app.use(ctx => {
  ctx.type = '.html';
  ctx.body = renderToStream(<Page />);
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});

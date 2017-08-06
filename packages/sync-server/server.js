import Koa from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { makePage } from 'view';

const app = new Koa();
const Page = makePage(React);

app.use(ctx => {
  ctx.body = renderToString(<Page />);
});

app.listen(3001, () => {
  console.log('Listening on http://localhost:3001');
});

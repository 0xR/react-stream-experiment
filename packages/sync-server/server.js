import Koa from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';

import newPage from 'view/Page';

const app = new Koa();
const Page = newPage(React);

app.use(ctx => {
  ctx.body = renderToString(<Page />);
});

app.listen(3001, () => {
  console.log('Listening on http://localhost:3001');
});

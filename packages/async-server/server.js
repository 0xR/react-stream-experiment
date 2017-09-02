import Koa from 'koa';
import { renderToString, renderToStream } from 'react-dom/server';
import render from 'react-redux-realworld-example-app';

const app = new Koa();

app.use(async (ctx) => {
  if (ctx.url.indexOf('/async/') === 0) {
    ctx.type = '.html';
    const url = ctx.url.replace('/async/', '/');
    const renderResult = await render(url);
    ctx.body = renderToStream(renderResult);
  } else if (ctx.url.indexOf('/sync/') === 0) {
    const url = ctx.url.replace('/sync/', '/');
    const renderResult = await render(url);
    ctx.body = renderToString(renderResult);
  }
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});

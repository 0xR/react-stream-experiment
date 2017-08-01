import Koa from 'koa';

const app = new Koa();

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
});

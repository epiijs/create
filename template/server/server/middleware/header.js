module.exports = async function (ctx, next) {
  console.log(`<${ctx.method}>`, ctx.path, ctx.get('user-agent'))
  await next()
}

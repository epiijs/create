module.exports = function* (next) {
  console.log(this.get('user-agent'))
  yield next
}

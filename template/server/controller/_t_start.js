module.exports = [
  {
    path: '/',
    verb: 'get',
    body: function* () {
      return this.epii.view('/start', { title: '${project}' })
    }
  }
]

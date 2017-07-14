import React from 'react'
import Minion from '../src/index.jsx'

export default class extends React.Component {
  static getMeta() {
    return {
      title: "${project}"
    }
  }

  render() {
    return (
      <article>
        <section>
          <Minion />
        </section>
      </article>
    )
  }
}

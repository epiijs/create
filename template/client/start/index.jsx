import React, {Component} from 'react'

export default class extends Component {
  constructor() {
    super()
    this.state = window.epii.model
  }

  render() {
    var { title } = this.state
    return (
      <div className='container'>
        {title}
      </div>
    )
  }
}

import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {normal: [], secret: []}
  }

  async componentDidMount() {
    const files = await axios.get('/api/files')
    this.setState(files.data)
  }

  render() {
    return (
      <FileNavigator normal={this.state.normal} secret={this.state.secret} /> 
    )
  }
}

class FileNavigator extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let normal = this.props.normal.map((item, index) => (
      <li className="normal" key={index}>
        <a className="file" href={'/api/files/' + item}>{item}</a>
      </li>
    ))
    if(this.props.secret.length > 0) {
      console.log('Concatenating secret files')
      normal = normal.concat(this.props.secret.map((item, index) => (
        <li className="secret" key={index + this.props.normal.length}>
          <a className="file" href={'/api/files/' + item}>{item}</a>
        </li>
      )))
    }
    return (
      <div id="files">
        <ul>{normal}</ul>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('container'))
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
      <div className="main">
        <SetCookie />
        <FileNavigator normal={this.state.normal} secret={this.state.secret} /> 
      </div>
    )
  }
}
class SetCookie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {key: '', value: ''}
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setCookie(e) { 
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    const newCookie = `${this.state.key}=${this.state.value}; Expires=${d.toGMTString()};`
    document.cookie = newCookie
    console.log(document.cookie)
    console.log(newCookie)
    
    document.getElementById('cookie-notify-msg').className = ''
    setTimeout(() => {
      document.getElementById('cookie-notify-msg').className = 'hidden'
    }, 2000)
    axios.post('/api/shouldRefresh', this.state)
      .then((data => {
        this.setState({
          key: '',
          value: ''
        })
        document.getElementById('key').value = ''
        document.getElementById('value').value = ''
        if(data.data.shouldRefresh) document.location.reload()
      }).bind(this))
  }
  render() {
    return (
      <div className="set-cookie">
        <div>
          <label htmlFor="key">Key</label>
          <input type="text" name="key" id="key" onChange={this.onChange.bind(this)} />
        </div>
        <div>
          <label htmlFor="value">Value</label>
          <input type="text" name="value" id="value" onChange={this.onChange.bind(this)} />
        </div>
        <div>
          <button onClick={this.setCookie.bind(this)}>Set Cookie</button>
        </div>
        <span id="cookie-notify-msg" className="hidden">Cookie set</span>
      </div>
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
import React, {Component} from 'react'
import Header from '../Header'
import './index.css'

class Results extends Component {
  state = {
    score: 0,
    timeTaken: 0,
    reason: '',
  }

  componentDidMount() {
    const {location} = this.props
    const {reason} = location.state

    // Assuming score and time taken are stored in localStorage
    const score = localStorage.getItem('score') || 0
    const timeTaken = localStorage.getItem('timeTaken') || 0

    this.setState({
      score: parseInt(score, 10),
      timeTaken: parseInt(timeTaken, 10),
      reason,
    })
  }

  handleReattempt = () => {
    // Resetting score and time taken values
    localStorage.setItem('score', 0)
    localStorage.setItem('timeTaken', 0)

    // Navigating to Assessment Route
    const {history} = this.props
    history.push('/assessment')
  }

  render() {
    const {score, timeTaken, reason} = this.state

    return (
      <div>
        <Header />
        <div className="results-container">
          <div className="results-content">
            {reason === 'time up' ? (
              <>
                <img
                  src="https://png.pngtree.com/png-clipart/20211111/ourmid/pngtree-game-times-up-timing-font-effect-ui-png-image_222226.png"
                  alt="time up"
                  className="time-up-img"
                />
                <h1>Time is up!</h1>
                <h1>Your Score: {score}</h1>
              </>
            ) : (
              <>
                <img
                  src="https://intelligentonline.co.uk/wp-content/uploads/2018/07/shutterstock_142333726b.jpg"
                  alt="submit"
                  className="submit-img"
                />
                <h1>Assessment Submitted</h1>
                <h1>Your Score: {score}</h1>

                <p>
                  Time Taken:{' '}
                  {new Date(timeTaken * 1000).toISOString().substr(11, 8)}
                </p>
              </>
            )}
            <p></p>
            <button type="button" onClick={this.handleReattempt}>
              Re attempt
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Results

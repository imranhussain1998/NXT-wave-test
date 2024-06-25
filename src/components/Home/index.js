import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Instructions</h1>
          <ol className="instructions-list">
            <li>Total Questions: 10</li>
            <li>Types of Questions: MCQs</li>
            <li>Duration: 10 Mins</li>
            <li>Marking Scheme: Every Correct response, get 1 mark</li>
            <li>
              All the progress will be lost, if you reload during the assessment
            </li>
          </ol>
          <Link to="/assessment">
            <button type="button" className="start-button">
              Start Assessment
            </button>
          </Link>
        </div>
        <div>
          <img
            className="website"
            src="https://cdn.pixabay.com/photo/2014/06/03/19/38/test-361512_640.jpg"
            alt="assessment"
          />
        </div>
      </div>
    </>
  )
}

export default Home

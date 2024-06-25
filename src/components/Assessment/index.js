import React, {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Assessment extends Component {
  state = {
    questionsCount: 0,
    questionDetails: [],
    currentQuestionIndex: 0,
    apiStatus: apiStatusConstants.initial,
    loading: true,
    error: '',
    answeredQuestionsCount: 0,
    timer: 600,
    selectedOptions: {},
  }

  componentDidMount() {
    this.fetchQuestions()
    this.timerID = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick = () => {
    this.setState(prevState => {
      if (prevState.timer > 0) {
        return {timer: prevState.timer - 1}
      } else {
        this.handleSubmit('time up')
        return {timer: 0}
      }
    })
  }

  fetchQuestions = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/assess/questions`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.questions.map(details => ({
        id: details.id,
        optionstype: details.options_type,
        questiontext: details.question_text,
        options: details.options,
      }))
      this.setState({
        questionsCount: fetchedData.total,
        questionDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleNextQuestion = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }))
  }

  handleQuestionClick = index => {
    this.setState({
      currentQuestionIndex: index,
    })
  }

  handleSubmit = reason => {
    const {questionDetails, selectedOptions} = this.state
    let score = 0

    // Calculate the score
    questionDetails.forEach(question => {
      const correctOption = question.options.find(option => option.is_correct)
      if (selectedOptions[question.id] === correctOption.id) {
        score += 1
      }
    })

    // Save score and time taken in localStorage
    localStorage.setItem('score', score)
    localStorage.setItem('timeTaken', 600 - this.state.timer)

    this.props.history.push('/results', {reason})
  }

  handleOptionSelect = (questionId, optionId) => {
    this.setState(prevState => {
      const previouslySelected = prevState.selectedOptions[questionId]
      let answeredQuestionsCount = prevState.answeredQuestionsCount

      if (!previouslySelected) {
        answeredQuestionsCount += 1
      }

      return {
        selectedOptions: {
          ...prevState.selectedOptions,
          [questionId]: optionId,
        },
        answeredQuestionsCount,
      }
    })
  }

  renderQuestionDetails = () => {
    const {
      questionsCount,
      questionDetails,
      currentQuestionIndex,
      timer,
      selectedOptions,
      answeredQuestionsCount,
    } = this.state

    const currentQuestion = questionDetails[currentQuestionIndex]
    const unansweredQuestionsCount = questionsCount - answeredQuestionsCount

    return (
      <div className="assessment-container">
        <div className="countingquestion">
          <h2 className="main-heading">Questions - {questionsCount}</h2>
          <p className="timer">
            Time Left: {new Date(timer * 1000).toISOString().substr(11, 8)}
          </p>
        </div>
        <div className="question-container">
          <p>{currentQuestion.questiontext}</p>
          {currentQuestion.optionstype === 'DEFAULT' && (
            <ul>
              {currentQuestion.options.map(option => (
                <li key={option.id}>
                  <button
                    type="button"
                    className={
                      selectedOptions[currentQuestion.id] === option.id
                        ? 'selected-option'
                        : ''
                    }
                    onClick={() =>
                      this.handleOptionSelect(currentQuestion.id, option.id)
                    }
                  >
                    {option.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {currentQuestion.optionstype === 'IMAGE' && (
            <ul>
              {currentQuestion.options.map(option => (
                <li key={option.id}>
                  <button
                    type="button"
                    className={
                      selectedOptions[currentQuestion.id] === option.id
                        ? 'selected-option'
                        : ''
                    }
                    onClick={() =>
                      this.handleOptionSelect(currentQuestion.id, option.id)
                    }
                  >
                    <img src={option.image_url} alt={option.text} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {currentQuestion.optionstype === 'SINGLE_SELECT' && (
            <>
              <p>First option is selected by default</p>
              <select
                onChange={e =>
                  this.handleOptionSelect(currentQuestion.id, e.target.value)
                }
                value={
                  selectedOptions[currentQuestion.id] ||
                  currentQuestion.options[0].id
                }
              >
                {currentQuestion.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        <div className="countingquestion">
          <h1 className="count">
            Answered Questions: {answeredQuestionsCount}
          </h1>
          <h1 className="count">
            Unanswered Questions: {unansweredQuestionsCount}
          </h1>
        </div>
        {currentQuestionIndex < questionDetails.length - 1 && (
          <button className="button1" onClick={this.handleNextQuestion}>
            Next Question
          </button>
        )}
        {currentQuestionIndex === questionDetails.length - 1 && (
          <button onClick={() => this.handleSubmit('submit')}>
            Submit Assessment
          </button>
        )}
        <ul className="question-numbers-list">
          {questionDetails.map((question, index) => (
            <li key={question.id}>
              <button
                className="buttonquestionnoseries"
                onClick={() => this.handleQuestionClick(index)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => this.handleSubmit('submit')}>
          Submit Assessment
        </button>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">We are having some trouble</p>
      <button type="button" onClick={this.fetchQuestions}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderQuestionDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAllViews()}
      </div>
    )
  }
}

export default Assessment

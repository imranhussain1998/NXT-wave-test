import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="nav-logo-link">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dusfbchnr/image/upload/v1719030132/Group_8004_xn8lu4.png"
            alt="website logo"
          />
        </Link>
      </div>
      <div>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)

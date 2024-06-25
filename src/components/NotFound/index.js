import {Component} from 'react'

class NotFound extends Component {
  render() {
    return (
      <div className="notfound-container">
        <img
          src="https://res.cloudinary.com/dusfbchnr/image/upload/v1718951282/Group_7504_2_cogxhn_x86hir.png"
          alt="not found"
        />
        <h1>Page Not Found</h1>
        <p>We are sorry, the page you requested could not be found</p>
      </div>
    )
  }
}

export default NotFound

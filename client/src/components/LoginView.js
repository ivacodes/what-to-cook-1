import React, { Component } from "react";
import "./LoginView.css";
import { withRouter } from "react-router";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      existingUser: {
        username: "",
        password: "",
      },
      userLoggedIn: 0,
      userLoginError: 0,
      errorMessage: "Incorrect login",
    };
  }
  handleInputChange = (e) => {
    let existingUser = this.state.existingUser;
    existingUser[e.target.name] = e.target.value;
    this.setState({
      existingUser,
    });
  };

  handleSubmit = (e) => {
    const { existingUser } = this.state;
    e.preventDefault();
    this.storeUser(existingUser);
  };

  storeUser = async (existingUser) => {
    //this.errorMessage = "";
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingUser),
      });
      const json = await response.json();
      console.log(json);
      if (json.msg === "User OK") {
        this.setState({
          userLoggedIn: 1,
          userLoginError: 0,
        });
        let token = json.token;
        console.log(token);
        localStorage.setItem("token", token);

        //redirect to home on successfull login
        this.props.history.push(`/`);

        //reload page to get user version of home screen with different nav
        window.location.reload(false);
      } else {
        this.setState({ userLoginError: 1, userLoggedIn: 0 });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { username, password } = this.state.existingUser;
    const { userLoginError, errorMessage } = this.state;
    return (
      <React.Fragment>
        <div className="col-sm-6 text-center d-flex justify-content-center align-items-center">
          <div className="box">
            <h1 className="mb-4" id="titleLogin">
              Log In
            </h1>
            <form
              onSubmit={this.handleSubmit}
              className="inputs d-inline-block text-center"
              id="form-login"
            >
              <input
                type="text"
                name="username"
                value={username}
                placeholder="Username..."
                onChange={this.handleInputChange}
                required
                pattern="[A-Za-z0-9]{2,}"
                className="form-control-lg mb-4 custom-input-placeholder"
              ></input>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password..."
                onChange={this.handleInputChange}
                required
                className="form-control-lg mb-4 custom-input-placeholder"
              ></input>
              <button
                type="sumbit"
                className="form-control-lg"
                id="buttonLogin"
              >
                Submit
              </button>
              {userLoginError ? <p>{errorMessage}</p> : null}
            </form>
          </div>
        </div>
        <div id="f1_container">
          <div id="f1_card">
            <div className="col-sm-6">
              <img
                src="/images/pizza.jpg"
                alt="pizza"
                width="530"
                className="rounded-lg mx-auto d-block flip-box-back"
                id="imagelogin"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(LoginView);

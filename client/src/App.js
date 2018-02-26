import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import axios from "axios";
import "./css/bulma.css";
import "./App.css";

/*
  Route Components
*/
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile/Profile";
import Serials from "./Pages/Serials/Serials/Serials";
import Authorization from "./Pages/Authorization/Authorization/Authorization";
import Header from "./Components/Common/Header/Header";
import Footer from "./Components/Common/Footer/Footer";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserDirectory from "./Pages/UserDirectory/UserDirectory";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import NotFound from "./Pages/NotFound/NotFound";
import store from "store";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentSerial: null,
      serialParts: null,
      isAuthenticated: false
    };
    this.setUser = this.setUser.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.getUser = this.getUser.bind(this);
    this.clearUser = this.clearUser.bind(this);

    this.setSerial = this.setSerial.bind(this);
    this.getSerialAndPartData = this.getSerialAndPartData.bind(this);

  }

  /**
    Set the user in the store and the client
  **/
  setUser(user){
    const clientUser = {
      username: user.username,
      id: user._id
    };
    store.set("client", {user: clientUser});
    this.setState({
      user: store.get("client").user
    });
  }

  /**
    Get the user in the store
  **/
  getUser(){
    return store.get("client");
  }

  clearUser(){
    store.remove("client");
    this.setState({
      user: null,
      isAuthenticated: false
    });
  }
  setAuthStatus(authenticationResponse){
    this.setState({
      isAuthenticated: authenticationResponse
    });
  }
  async componentWillMount(){
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const uri = "/users/auth";
    const result = await axios.get(uri, {withCredentials: true});
    if (result.data.isAuthenticated){
      this.setState({
        isAuthenticated: true,
        user: result.data.user
      });
    } else{
      this.setState({
        isAuthenticated: false,
        user: null
      });
    }
    // otherwise, make sure authentication is false
  }

  setSerial(currentSerial, serialParts){
    this.setState({
      currentSerial,
      serialParts
    });
  }

  async getSerialAndPartData(serialId){
    const uri = `/serials/${serialId}`;
    const config = {
      withCredentials: true
    };
    const result = await axios.get(uri, config);
    this.setSerial(result.data.serial, result.data.serialParts);
    console.log(result);
  }

  render() {
    return (
      <Router>

        <div>
          <div className="main-wrapper">
            <Header authStatus={this.state.isAuthenticated} clientUser={this.state.user}/>
            <div className="container is-fluid">
              <Switch>
                <Route
                  exact path="/"
                  component={Home}/>

                <Route
                  path="/auth"
                  render={() =>
                    <Authorization
                      clearUser={this.clearUser}
                      setUser={this.setUser}
                      onSignIn={this.checkAuthentication}
                      user={this.state.user} />} />
                <Route
                  path="/users/:username"
                  render={ () =>
                    <Profile
                      clientUser={this.state.user}/>} />
                <Route
                  path="/users"
                  authStatus={this.state.isAuthenticated}
                  clientUser={this.state.user}
                  component={UserDirectory} />

                <Route
                  path="/serials"
                  render={()=>
                    <Serials
                      authStatus={this.state.isAuthenticated}
                      clientUser={this.state.user}
                      setSerial={this.setSerial}
                      getSerialData={this.getSerialAndPartData}
                      setCurrentPart={this.setCurrentSerialPart}
                      currentSerial={this.state.currentSerial}
                      serialParts={this.state.serialParts}
                      currentSerialPart={this.state.currentSerialPart}
                      clearCurrentPart={this.clearCurrentSerialPart}/> } />

                <PrivateRoute
                  path="/dashboard"
                  checkAuthentication={this.checkAuthentication}
                  authStatus={this.state.isAuthenticated}
                  clientUser={this.state.user}
                  component={Dashboard} />

                <Route component={NotFound} />
              </Switch>

            </div>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
export default App;

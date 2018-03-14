import React from "react";
import PropTypes from "prop-types";
import {
  Link
} from "react-router-dom";

import SerialList from "../../Components/Common/SerialList/SerialList";
import getUserSerialSubscriptions from "../../utilityFunctions/serials/getUserSerialSubscriptions";
import "./Dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribedSerials: [],
      clientUserSerials: []
    };
  }

  async componentDidMount(){
    await this.props.checkAuthentication();
    await this.getSubscribedSerials();
    const clientSerials = await this.props.getClientUserSerials();
    this.setState({
      clientUserSerials: clientSerials
    });
  }

  async getSubscribedSerials(){
    const subscribedSerials = await getUserSerialSubscriptions();
    this.setState({
      subscribedSerials
    });
  }

  render() {
    let createSerial;
    const newSerialLink = `/serials/create`;
    createSerial = <Link className="button level-item" to={newSerialLink}> Create a new Serial </Link>;

    return (
      <div>
        <h1 className="title is-4"> Welcome back, {this.props.clientUser.username} </h1>
        <div className="level">
          <Link className="button level-item" to={`/users/${this.props.clientUser.username}`}> Profile </Link>
        </div>
        {createSerial}
        <SerialList
          clientUser={this.props.clientUser}
          headerText="Your Serials"
          emptyListMessage="You have not written any serials yet."
          serials={this.state.clientUserSerials}/>
        <SerialList
          clientUser={this.props.clientUser}
          headerText="Subscribed Serials"
          emptyListMessage="You have not subscribed to any serials yet."
          serials={this.state.subscribedSerials}/>
      </div>
    );
  }
}

Dashboard.propTypes = {
  checkAuthentication: PropTypes.func.isRequired,
  clientUser: PropTypes.object.isRequred,
  history: PropTypes.object.isRequired,
  getClientUserSerials: PropTypes.func
};

export default Dashboard;

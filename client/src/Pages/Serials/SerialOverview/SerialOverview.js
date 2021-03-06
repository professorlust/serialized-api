import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import SerialPartList from "../../../Components/Common/SerialPartList/SerialPartList";
import "./SerialOverview.css";

class SerialOverview extends React.Component {
  async componentDidMount() {
    await this.props.getSerialData(this.props.match.params.id);
  }

  render() {
    if (this.props.currentSerial) {
      let nsfw;
      if (this.props.currentSerial.nsfw) {
        nsfw = ", NSFW";
      }

      return (
        <main className="serial-overview">
          <header className="container">
            <div className="serial-metadata">
              <div className="serial-metadata-info">
                <h1 className="title"> {this.props.currentSerial.title}</h1>
                <p className="subtitle">
                  By{" "}
                  <Link
                    to={`/users/${
                      this.props.currentSerial.author_id.username
                    }`}>
                    {this.props.currentSerial.author_id.username}
                  </Link>
                </p>
                <p className="genre">
                  {this.props.currentSerial.genre}
                  {nsfw}
                </p>
                <p>{this.props.currentSerial.synopsis}</p>
              </div>
              <div className="serial-metadata-options right-aligned">
                {this.props.clientUser &&
                this.props.currentSerial.author_id &&
                this.props.clientUser._id ===
                  this.props.currentSerial.author_id._id ? (
                  <Fragment>
                    <Link
                      className="button button--primary serial-overview-user-option"
                      to={`/serials/${this.props.currentSerial._id}/new`}>
                      {" "}
                      Create a New Part{" "}
                    </Link>
                    <Link
                      className="button button--warn serial-overview-user-option"
                      to={`/serials/${this.props.currentSerial._id}/edit`}>
                      {" "}
                      Edit Serial Details{" "}
                    </Link>
                  </Fragment>
                ) : null}
              </div>
            </div>
            <hr className="horizontal-rule" />
          </header>
          <section className="container">
            <SerialPartList
              getSerialData={this.props.getSerialData}
              clientUser={this.props.clientUser}
              currentSerial={this.props.currentSerial}
              serialParts={this.props.serialParts}
            />
          </section>
        </main>
      );
    } else {
      return <h1> Loading Serial Data... </h1>;
    }
  }
}

SerialOverview.propTypes = {
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  serial: PropTypes.object,
  serialParts: PropTypes.array,
  getSerialData: PropTypes.func.isRequired,
  currentSerial: PropTypes.object
};

export default withRouter(SerialOverview);

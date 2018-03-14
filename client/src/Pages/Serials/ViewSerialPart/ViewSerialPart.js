import React from "react";
import PropTypes from "prop-types";
import {
  withRouter,
  Link
} from "react-router-dom";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialStepper from "../../../Components/SerialStepper/SerialStepper";
import LikeButton from "../../../Components/Common/LikeButton/LikeButton";
import LikeCounter from "../../../Components/Common/LikeCounter/LikeCounter";
import getLikes from "../../../utilityFunctions/getLikes";
import getSerialPart from "../../../utilityFunctions/serials/getSerialPart";
import "../../../css/bulma.css";

class ViewSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      part: null,
      likes: []
    };
    this.getLikes = this.getLikes.bind(this);
  }

  async componentDidMount(){
    if (this.props.currentSerial == null || this.props.currentSerial._id !== this.props.match.params.id){
      await this.props.getSerialData(this.props.match.params.id);
    }
    await this.getSerialPart();
    await this.getLikes();
  }

  async getSerialPart(){
    const response = await getSerialPart(this.props.match.params.id, this.props.match.params.partId);
    this.setState({ part: response.part });
  }

  async getLikes(){
    try{
      const likes = await getLikes(1, this.props.match.params.partId);
      this.setState({
        likes: likes.data
      });
    } catch (e){
      throw e;
    }
  }

  render() {
    if (this.state.part){
      const parentSerialUri = `/serials/${this.props.currentSerial._id}`;
      let partEditLink;
      if (this.props.clientUser && this.props.clientUser._id === this.props.currentSerial.author_id._id){
        partEditLink = <Link className="button level-item" to={`/serials/${this.props.currentSerial._id}/${this.state.part._id}/edit`}> Edit </Link>;
      }

      return (
        <div className="container">
          <div className="level">
            <Link className="button level-item" to={parentSerialUri}>Back to {this.props.currentSerial.title}</Link>
            {partEditLink}
          </div>
          <h1 className="title"> {this.state.part.title}</h1>
          <p>{`Part ${(this.state.part.part_number+1)}`} of {`${this.props.serialParts.length} in ${this.props.currentSerial.title}`}</p>
          <HTMLMarkupContainer content={this.state.part.content} />
          <SerialStepper currentSerial={this.props.currentSerial} currentPart={this.state.part} serialParts={this.props.serialParts}/>


          {
            (this.props.clientUser && this.props.clientUser._id) ?
              <LikeButton  entityType="1" entityId={this.state.part._id} parentEntityId={this.props.currentSerial._id} getLikes={this.getLikes}/> :
              null
          }

          <LikeCounter totalLikes={this.state.likes.length} />


        </div>
      );
    } else{
      return null;
    }
  }
}

ViewSerialPart.propTypes = {
  match: PropTypes.object.isRequired,
  clientUser: PropTypes.object,
  currentSerial: PropTypes.object,
  getSerialData: PropTypes.func,
  serialParts: PropTypes.array
};

export default withRouter(ViewSerialPart);

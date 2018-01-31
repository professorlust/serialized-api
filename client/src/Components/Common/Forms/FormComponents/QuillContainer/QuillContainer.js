import React from "react";
import PropTypes from "prop-types";
import Quill from "quill";
import "./quill.snow.css";
import QuillDeltaToHtmlConverter from "quill-delta-to-html";

class QuillContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contents: null
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.convertQuillDelta = this.convertQuillDelta.bind(this);
  }
  componentDidMount(){
    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: this.props.toolbarOptions
      }
    });

    quill.on("text-change", () => {
      this.setState({
        contents: quill.getContents()
      });
      this.convertQuillDelta();
    });

    this.setState({
      quill
    });
  }
  convertQuillDelta(){
    const deltaOps = this.state.contents.ops;
    const c = {};
    const converter = new QuillDeltaToHtmlConverter(deltaOps, c);
    const html = converter.convert();
    this.props.textChanged(html);
  }
  handleUserInput(){

  }
  render(){
    return (
      <div>
        <h1> Quill Container </h1>
        <div id="editor"></div>
        <button> Submit </button>
      </div>
    );
  }
}

QuillContainer.propTypes ={
  textChanged: PropTypes.func.isRequired,
  toolbarOptions: PropTypes.array
};

export default QuillContainer;

import { Component } from "react";

export class UserIdForm extends Component {
  constructor(props) {
    super(props);
    this.state = { userId: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ userId: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.userId);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          UserId:
          <input
            type="text"
            value={this.state.userId}
            onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

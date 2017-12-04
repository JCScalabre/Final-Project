import React, { Component } from "react";
import $ from "jquery";
// import { Link } from "react-router-dom";
// import API from "../../utils/API";
import moment from "moment";
import Modal from "react-responsive-modal";
import "./Chat.css";
import { Link } from "react-router-dom";

const io = require("socket.io-client");
const socket = io();

// var today = moment().format("MM DD YY");

class Chat extends Component {
	state = {
		modalIsOpen: true
	};

	componentWillMount() {}

	componentDidMount() {
		socket.on("message", message => {
			var time = message.time;
			var contents = message.message;
			var name = message.name;
			var messagetoappend = `<div class='chatmsg'> [${time}] ${name}: ${
				contents
			} </div>`;
			$("#chatbg").append(messagetoappend);
			var scrollHeight = $("#chatbg")[0].scrollHeight;
			$("#chatbg").scrollTop(scrollHeight);
		});
	}

	handleNameSubmit = event => {
		event.preventDefault();
		this.closeModal();
		if ($("#chatname").val() === "") {
			this.setState({ name: "Anonymous" });
		} else {
			this.setState({ name: $("#chatname").val() });
		}
	};

	handleMsgSubmit = event => {
		event.preventDefault();
		this.setState({ message: $("#message").val() });
		let ObjToEmit = {};
		ObjToEmit.name = this.state.name;
		ObjToEmit.message = $("#message").val();
		ObjToEmit.time = moment().format("h:mm A");
		if (ObjToEmit.message !== "") {
			socket.emit("message", ObjToEmit);
		}
		$("#message").val("");
	};

	openModal = () => {
		this.setState({ modalIsOpen: true });
	};

	closeModal = () => {
		this.setState({ modalIsOpen: false });
		$("#message").focus();
	};

	render() {
		return (
			<div>
				<div className="title">Chat</div>
				<div className="container">
					<div className="row">
						<div className="col text-center">
							<Link to="/memorytiles">
								<button id="back" className="btn btn-primary">
									<i className="fa fa-arrow-left" aria-hidden="true" />
									Back to Game
								</button>
							</Link>
						</div>
						<div className="col-6">
							<div id="chatbg" />
							<div id="messagebar" className="col cyan">
								<form onSubmit={this.handleMsgSubmit}>
									<div className="input-group">
										<input
											autoComplete="off"
											className="form-control"
											id="message"
											type="text"
										/>
										<span className="input-group-btn">
											<button
												className="btn btn-primary messagesend"
												type="submit"
											>
												Send{" "}
												<i
													className="fa fa-arrow-circle-up"
													aria-hidden="true"
												/>
											</button>
										</span>
									</div>
								</form>
							</div>
						</div>
						<div className="col">
						</div>
					</div>
				</div>
				<Modal
					open={this.state.modalIsOpen}
					onClose={this.closeModal}
					little
					showCloseIcon={false}
					closeOnEsc={false}
					closeOnOverlayClick={false}
					classNames={{ modal: "name-modal" }}
				>
					<h2>Please enter your name to continue</h2>
					<form onSubmit={this.handleNameSubmit}>
						<div id="nameinput" className="input-group">
							<input
								autoComplete="off"
								className="form-control"
								id="chatname"
								type="text"
							/>
							<span className="input-group-btn">
								<button
									id="chatnamebtn"
									className="btn btn-primary"
									type="submit"
								>
									Submit
								</button>
							</span>
						</div>
					</form>
				</Modal>
			</div>
		);
	}
}

export default Chat;
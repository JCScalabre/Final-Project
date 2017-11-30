import React, { Component } from "react";
import $ from "jquery";
import BlankGrid from "./BlankGrid";
import SolutionGrid from "./SolutionGrid";
import UserGrid from "./UserGrid";
import Modal from "../Modal";
import API from "../../utils/API";
import { Link } from "react-router-dom";

const grey = "rgb(80, 80, 80)";
const cyan = "rgb(0, 194, 255)";
let gameisrunning = false;

class MemoryTiles extends Component {
	state = {
		solution: [
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		grid: []
	};

	componentWillMount() {
		// Shuffle our solution grid:
		this.shuffle(this.state.solution);
		// Set up our user input grid:
		this.setUserGrid();
	}

	// Our function that 'shuffles' an array using the Durstenfeld shuffle:
	shuffle = array => {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	};

	// Set up user input grid:
	setUserGrid = () => {
		for (var i = 0; i < 25; i++) {
			this.state.grid.push(0);
		}
	};

	// Our function that changes the color and state of the user input grid when a square is clicked:
	changecolor = event => {
		var color = $(event.target).css("background-color");
		var i = $(event.target).attr("tilenumber");
		if (color === grey) {
			$(event.target).css("background-color", cyan);
			var newState = this.state.grid;
			newState[i] = 1;
			this.setState({ grid: newState });
		}
		if (color === cyan) {
			$(event.target).css("background-color", grey);
			var newState2 = this.state.grid;
			newState2[i] = 0;
			this.setState({ grid: newState2 });
		}
	};

	// When the start button is pressed:
	start = event => {
		if (gameisrunning === false) {
			gameisrunning = true;
			event.preventDefault();
			$("#blankgrid").css("display", "none");
			$("#solutiongrid").css("display", "block");
			$("#submit").css("display", "block");
			setTimeout(function() {
				$("#solutiongrid").css("display", "none");
				$("#usergrid").css("display", "block");
			}, 5000);
		}
	};

	// When the submit button is pressed:
	submit = event => {
		event.preventDefault();
		var result = 0;
		var name = $("#name").val();
		if (name === "") {
			name = "Anonymous";
		}
		for (var i = 0; i < this.state.solution.length; i++) {
			if (this.state.solution[i] === this.state.grid[i]) {
				result++;
			}
		}
		var objToSendToDB = {};
		objToSendToDB.name = name;
		objToSendToDB.score = result * 100 / 25;
		API.submitScore(objToSendToDB);
		this.setState({ result: result });
	};

	render() {
		return (
			<div className="container">
				<div id="header" className="row">
					<div className="col title">MEMORY TILES</div>
				</div>
				<div className="row justify-content-md-center">
					<div className="col instructions">
						<div className="cyan">
							Instructions: <br /> A random pattern will appear for 5
							seconds. Try your best to memorize it and recreate it. When
							you're ready, press Start to begin!
						</div>
						<div className="row justify-content-md-center">
							<button
								id="start"
								className="btn btn-primary"
								onClick={this.start}
							>
								Start
							</button>
						</div>
					</div>
					<div className="col-md-auto text-center">
						<BlankGrid />
						<SolutionGrid solution={this.state.solution} />
						<UserGrid
							grid={this.state.grid}
							changecolor={this.changecolor}
						/>
						<br />
						<Link to="/">
							<button className="btn btn-primary">Home</button>
						</Link>
						<Link to="/leaderboard">
							<button className="btn btn-primary">
								View Leaderboard
							</button>
						</Link>
					</div>
					<div className="col">
						<form>
							<div className="form-group cyan">
								<label>Enter your name:</label>
								<p id="leaveblank">(or leave blank to submit your score anonymously)</p>
								<input autoComplete="off" className="form-control" id="name" />
							</div>
						</form>
						<button
							id="submit"
							className="btn btn-primary"
							data-toggle="modal"
							data-target="#testmodal"
							onClick={this.submit}
						>
							Submit
						</button>
					</div>
				</div>
				<Modal result={this.state.result} />
			</div>
		);
	}
}

export default MemoryTiles;

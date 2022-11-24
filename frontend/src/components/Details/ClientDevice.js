import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import EditDevice from "../Devices/EditDevice";
import { Route, Link, Routes } from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function formatDate(date) {
	return (
		[
			date.getFullYear(),
			padTo2Digits(date.getMonth() + 1),
			padTo2Digits(date.getDate()),
		].join("-") +
		" " +
		[
			padTo2Digits(date.getHours()),
			padTo2Digits(date.getMinutes()),
			padTo2Digits(date.getSeconds()),
		].join(":")
	);
}

class ClientDevice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			dataEmpty: false,
			nameSpace: window.location.href.split("/")[5],
			client: "",
			id: window.location.href.split("/")[4].split("?")[0],
		};
	}

	componentDidMount() {
		this.state.client = this.state.nameSpace.replace("$", " ");
		this.feachdevices(this.state.id);
	}

	componentWillUnmount() {
		this.feachdevices();
	}

	async feachdevices(id) {
		axios
			.get(`${process.env.REACT_APP_API_URL}client-device/` + id)
			.then((res) => {
				const devices = res.data;
				this.setState({ devices });
				this.state.dataEmpty = true;
			});
	}

	async deleteDevice(id) {
		const devices = [...this.state.devices].filter(
			(device) => device.id !== id
		);
		axios
			.delete(`${process.env.REACT_APP_API_URL}client-device/` + id)
			.then((res) => {
				this.setState({ devices });
			});
	}
	render() {
		let table;
		if (this.state.devices.length !== 0) {
			table = (
				<>
					<h1 className='header'>Devices to client {this.state.client}</h1>
					<a
						href={
							"/client-device/create/" +
							this.state.id +
							"/" +
							this.state.nameSpace
						}>
						<Button className='float-end bnt-action' variant='primary'>
							Add
						</Button>
					</a>
					<Table className='mt-5' striped hover>
						<thead>
							<tr>
								<th>Status</th>
								<th>Name</th>
								<th>Ip</th>
								<th>Type</th>
								<th>Date ping</th>
								<th>Date activity</th>
								<th>message</th>
								<th>params</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.devices.map((device) => {
								let date_ping = "";
								let date_activity = "";
								if (device.date_ping !== null) {
									const dPing = new Date(device.date_ping);
									date_ping = formatDate(dPing);
								}

								if (device.date_activity !== null) {
									const dActivity = new Date(device.date_activity);
									date_activity = formatDate(dActivity);
								}
								return (
									<tr key={device.id}>
										<td>{device.status}</td>
										<td>{device.name_device}</td>
										<td>{device.ip_device}</td>
										<td>{device.type}</td>
										<td>{date_ping}</td>
										<td>{date_activity}</td>
										<td>{device.message}</td>
										<td>{device.params}</td>
										<td>
											<AiIcons.AiFillDelete
												title='delete'
												className='icon-table'
												onClick={(key) => this.deleteDevice(device.id)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</>
			);
		} else {
			table = (
				<>
					<h1 className='noElement'>No devices in {this.state.client}</h1>
					<a
						href={
							"/client-device/create/" +
							this.state.id +
							"/" +
							this.state.nameSpace
						}>
						<Button className='float-end bnt-action' variant='primary'>
							Add
						</Button>
					</a>
				</>
			);
		}
		return (
			<div>
				{this.state.dataEmpty ? (
					<Container className='mt-4'>{table}</Container>
				) : (
					<div className='spinner'>
						<Spinner animation='border' role='status'>
							<span className='visually-hidden'>Loading...</span>
						</Spinner>
					</div>
				)}
			</div>
		);
	}
}

export default ClientDevice;

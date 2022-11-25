import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
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
			statuses: [],
			dataEmpty: false,
			nameSpace: window.location.href.split("/")[5],
			client: "",
			id: window.location.href.split("/")[4].split("?")[0],
			searchStatus: "",
		};
	}

	componentDidMount() {
		this.setState({ client: this.state.nameSpace.replace("$", " ") });
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

				const pom = [];

				for (const device of devices) {
					if (device["status"] === null) device["status"] = " ";
					if (!pom.includes(device["status"])) {
						pom.push(device["status"]);
					}
				}
				this.setState({ statuses: pom });
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
					<div className='buttonsOverTable'>
						<Form.Select
							size='md'
							aria-label='Default select example'
							onChange={(e) => {
								this.setState({ searchStatus: e.target.value });
							}}
							className='selectStatus'>
							<option value='all'>Search status</option>
							{this.state.statuses.map((stat, index) => {
								return (
									<option key={index} value={stat}>
										{stat}
									</option>
								);
							})}
						</Form.Select>
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
					</div>

					<Table className='mt-5' hover>
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
							{this.state.devices
								.filter((value) => {
									if (this.state.searchStatus === "all") {
										return value;
									} else if (
										value["status"].includes(this.state.searchStatus)
									) {
										return value;
									}
								})
								.map((device) => {
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
									let statusColor = "";
									{
										if (device.status === "OK")
											statusColor = (
												<td className='StatusColor StatusOK'>
													{device.status}
												</td>
											);
										else if (device.status === "ERR")
											statusColor = (
												<td className='StatusColor StatusERR'>
													{device.status}
												</td>
											);
										else
											statusColor = (
												<td className='StatusColor StatusNEW'>
													{device.status}
												</td>
											);
									}

									return (
										<tr key={device.id}>
											{statusColor}
											<td>{device.name_device}</td>
											<td>{device.ip_device}</td>
											<td>{device.type}</td>
											<td>{date_ping}</td>
											<td>{date_activity}</td>
											<td>{device.message}</td>
											<td>{device.params}</td>
											<td>
												<AiIcons.AiFillEdit
													title='edit'
													className='icon-table'
													onClick={(key) => {
														this.editDeviceHandler(device);
													}}
												/>

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

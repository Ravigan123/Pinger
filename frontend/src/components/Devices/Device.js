import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditDevice from "./EditDevice";
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

function Device() {
	const [devices, setDevices] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [dataEmpty, setDataEmpty] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editDevices, setEditDevices] = useState({});
	const [searchStatus, setSearchStatus] = useState("");
	// const [rowsPerPage, setRowsPerPage] = useState(2);
	// const [itemOffset, setItemOffset] = useState(0);

	// const endOffset = itemOffset + rowsPerPage;
	// console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	// const currentItems = devices.slice(itemOffset, endOffset);
	// const pageCount = Math.ceil(devices.length / rowsPerPage);

	useEffect(() => {
		feachDevices();
		Modal.setAppElement("body");
	}, []);

	async function feachDevices() {
		await axios.get(`${process.env.REACT_APP_API_URL}device`).then((res) => {
			const devices = res.data;
			setDataEmpty(true);
			setDevices(devices);

			const pom = [];

			for (const device of devices) {
				if (device["status"] === null) device["status"] = " ";
				if (!pom.includes(device["status"])) {
					pom.push(device["status"]);
				}
			}
			setStatuses(pom);
		});
	}

	async function deleteDevice(id) {
		const device = devices.filter((device) => device.id !== id);
		axios.delete(`${process.env.REACT_APP_API_URL}device/` + id).then((res) => {
			setDevices(device);
		});
	}

	function toogleModal() {
		setShowEditModal(!showEditModal);
	}

	async function editDevice(device) {
		const id = device.id;
		await axios.put(`${process.env.REACT_APP_API_URL}device/` + id, device);

		if (id >= 0) {
			devices[id] = device;
			setDevices(devices);
			toogleModal();
		}
	}

	function editDeviceHandler(device) {
		console.log(device);
		setEditDevices(device);
		console.log(editDevices);
		toogleModal();
	}

	// const handlePageClick = (event) => {
	// 	const newOffset = (event.selected * rowsPerPage) % devices.length;
	// 	console.log(
	// 		`User requested page number ${event.selected}, which is offset ${newOffset}`
	// 	);
	// 	setItemOffset(newOffset);
	// 	console.log(currentItems);
	// };

	let table;

	if (devices.length !== 0) {
		table = (
			<>
				<h1 className='header'>Devices</h1>
				<div className='buttonsOverTable'>
					<Form.Select
						size='md'
						aria-label='Default select example'
						onChange={(e) => {
							setSearchStatus(e.target.value);
						}}
						className='selectStatus'>
						<option value='all'>Search status</option>
						{statuses.map((stat, index) => {
							return (
								<option key={index} value={stat}>
									{stat}
								</option>
							);
						})}
					</Form.Select>
					<a className='float-end' href='/device/many'>
						<Button className='bnt-many'>Add Many</Button>
					</a>
					<a className='float-end' href='/device/create'>
						<Button className='bnt-action'>Add</Button>
					</a>
				</div>
				<Modal isOpen={showEditModal} contentLabel='Edit device'>
					<EditDevice
						name={editDevices.name_device}
						ip={editDevices.ip_device}
						location={editDevices.id_location}
						type={editDevices.type}
						params={editDevices.params}
						id={editDevices.id}
						onCancel={() => {
							toogleModal();
						}}
						onEdit={(device) => editDevice(device)}
					/>
				</Modal>
				<Table className='mt-5' hover>
					<thead>
						<tr>
							<th>Status</th>
							<th>Location</th>
							<th>Name</th>
							<th>Ip</th>
							<th>Type</th>
							<th>Date ping</th>
							<th>Date activity</th>
							<th>Message</th>
							<th>Params</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{devices
							.filter((value) => {
								if (searchStatus === "all") {
									return value;
								} else if (value["status"].includes(searchStatus)) {
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
											<td className='StatusColor StatusOK'>{device.status}</td>
										);
									else if (device.status === "ERR")
										statusColor = (
											<td className='StatusColor StatusERR'>{device.status}</td>
										);
									else
										statusColor = (
											<td className='StatusColor StatusNEW'>{device.status}</td>
										);
								}

								return (
									<tr key={device.id}>
										{statusColor}
										<td>{device.name_location}</td>
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
													editDeviceHandler(device);
												}}
											/>

											<AiIcons.AiFillDelete
												title='delete'
												className='icon-table'
												onClick={(key) => deleteDevice(device.id)}
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
				<h1 className='noElement'>No devices</h1>
				<a className='float-end' href='/device/many'>
					<Button className='bnt-many'>Add Many</Button>
				</a>
				<a className='float-end' href='/device/create'>
					<Button className='bnt-action'>Add</Button>
				</a>
			</>
		);
	}

	return (
		<div>
			{dataEmpty ? (
				<Container className='mt-4'>
					{table}
					{/* <ReactPaginate
						className='pagination'
						nextLabel='next >'
						onPageChange={handlePageClick}
						pageRangeDisplayed={3}
						marginPagesDisplayed={2}
						pageCount={pageCount}
						previousLabel='< previous'
						pageClassName='page-item'
						pageLinkClassName='page-link'
						previousClassName='page-item'
						previousLinkClassName='page-link'
						nextClassName='page-item'
						nextLinkClassName='page-link'
						breakLabel='...'
						breakClassName='page-item'
						breakLinkClassName='page-link'
						containerClassName='pagination'
						activeClassName='active'
						renderOnZeroPageCount={null}
					/> */}
				</Container>
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

// class Device extends React.Component {
// 	async feachDevices() {
// 		axios.get(`${process.env.REACT_APP_API_URL}device`).then((res) => {
// 			const devices = res.data;
// 			this.state.dataEmpty = true;
// 			this.setState({ devices });

// 			const pom = [];

// 			for (const device of devices) {
// 				if (device["status"] === null) device["status"] = " ";
// 				if (!pom.includes(device["status"])) {
// 					pom.push(device["status"]);
// 				}
// 			}
// 			this.setState({ statuses: pom });
// 		});
// 		this.setState({
// 			indexOfLastRow: this.state.currentPage * this.state.rowsPerPage,
// 		});
// 		this.setState({
// 			indexOfFirstRow: this.state.indexOfLastRow - this.state.rowsPerPage,
// 		});
// 		this.setState({
// 			currentRows: this.state.devices.slice(
// 				this.state.indexOfFirstRow,
// 				this.state.indexOfLastRow
// 			),
// 		});
// 	}

// 	async deleteDevice(id) {
// 		const devices = [...this.state.devices].filter(
// 			(device) => device.id !== id
// 		);
// 		axios.delete(`${process.env.REACT_APP_API_URL}device/` + id).then((res) => {
// 			this.setState({ devices });
// 		});
// 	}

// 	toogleModal() {
// 		this.setState({ showEditModal: !this.state.showEditModal });
// 	}

// 	async editDevice(device) {
// 		const id = device.id;
// 		await axios.put(`${process.env.REACT_APP_API_URL}device/` + id, device);

// 		const devices = [...this.state.devices];
// 		if (id >= 0) {
// 			devices[id] = device;
// 			this.setState({ devices });
// 			this.toggleModal();
// 		}
// 	}

// 	editDeviceHandler(device) {
// 		this.toogleModal();
// 		this.setState({ editDevice: device });
// 	}

// 	render() {
// 		let table;
// 		console.log(this.state.indexOfFirstRow);
// 		console.log(this.state.indexOfLastRow);
// 		if (this.state.devices.length !== 0) {
// 			table = (
// 				<>
// 					<h1 className='header'>Devices</h1>
// 					<div className='buttonsOverTable'>
// 						<Form.Select
// 							size='md'
// 							aria-label='Default select example'
// 							onChange={(e) => {
// 								this.setState({ searchStatus: e.target.value });
// 							}}
// 							className='selectStatus'>
// 							<option value='all'>Search status</option>
// 							{this.state.statuses.map((stat, index) => {
// 								return (
// 									<option key={index} value={stat}>
// 										{stat}
// 									</option>
// 								);
// 							})}
// 						</Form.Select>
// 						<a className='float-end' href='/device/many'>
// 							<Button className='bnt-many'>Add Many</Button>
// 						</a>
// 						<a className='float-end' href='/device/create'>
// 							<Button className='bnt-action'>Add</Button>
// 						</a>
// 					</div>
// 					<Modal isOpen={this.state.showEditModal} contentLabel='Edit device'>
// 						<EditDevice
// 							name={this.state.editDevice.name_device}
// 							ip={this.state.editDevice.ip_device}
// 							location={this.state.editDevice.id_location}
// 							type={this.state.editDevice.type}
// 							params={this.state.editDevice.params}
// 							id={this.state.editDevice.id}
// 							onCancel={() => this.toogleModal()}
// 							onEdit={(device) => this.editDevice(device)}
// 						/>
// 					</Modal>
// 					<Table className='mt-5' hover>
// 						<thead>
// 							<tr>
// 								<th>Status</th>
// 								<th>Location</th>
// 								<th>Name</th>
// 								<th>Ip</th>
// 								<th>Type</th>
// 								<th>Date ping</th>
// 								<th>Date activity</th>
// 								<th>Message</th>
// 								<th>Params</th>
// 								<th>Action</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{this.state.devices
// 								.filter((value) => {
// 									if (this.state.searchStatus === "all") {
// 										return value;
// 									} else if (
// 										value["status"].includes(this.state.searchStatus)
// 									) {
// 										return value;
// 									}
// 								})
// 								.map((device) => {
// 									let date_ping = "";
// 									let date_activity = "";
// 									if (device.date_ping !== null) {
// 										const dPing = new Date(device.date_ping);
// 										date_ping = formatDate(dPing);
// 									}

// 									if (device.date_activity !== null) {
// 										const dActivity = new Date(device.date_activity);
// 										date_activity = formatDate(dActivity);
// 									}
// 									let statusColor = "";
// 									{
// 										if (device.status === "OK")
// 											statusColor = (
// 												<td className='StatusColor StatusOK'>
// 													{device.status}
// 												</td>
// 											);
// 										else if (device.status === "ERR")
// 											statusColor = (
// 												<td className='StatusColor StatusERR'>
// 													{device.status}
// 												</td>
// 											);
// 										else
// 											statusColor = (
// 												<td className='StatusColor StatusNEW'>
// 													{device.status}
// 												</td>
// 											);
// 									}

// 									return (
// 										<tr key={device.id}>
// 											{statusColor}
// 											<td>{device.name_location}</td>
// 											<td>{device.name_device}</td>
// 											<td>{device.ip_device}</td>
// 											<td>{device.type}</td>
// 											<td>{date_ping}</td>
// 											<td>{date_activity}</td>
// 											<td>{device.message}</td>
// 											<td>{device.params}</td>
// 											<td>
// 												<AiIcons.AiFillEdit
// 													title='edit'
// 													className='icon-table'
// 													onClick={(key) => {
// 														this.editDeviceHandler(device);
// 													}}
// 												/>

// 												<AiIcons.AiFillDelete
// 													title='delete'
// 													className='icon-table'
// 													onClick={(key) => this.deleteDevice(device.id)}
// 												/>
// 											</td>
// 										</tr>
// 									);
// 								})}
// 						</tbody>
// 					</Table>
// 				</>
// 			);
// 		} else {
// 			table = (
// 				<>
// 					<h1 className='noElement'>No devices</h1>
// 					<a className='float-end' href='/device/many'>
// 						<Button className='bnt-many'>Add Many</Button>
// 					</a>
// 					<a className='float-end' href='/device/create'>
// 						<Button className='bnt-action'>Add</Button>
// 					</a>
// 				</>
// 			);
// 		}
// 		return (
// 			<div>
// 				{this.state.dataEmpty ? (
// 					<Container className='mt-4'>{table}</Container>
// 				) : (
// 					<div className='spinner'>
// 						<Spinner animation='border' role='status'>
// 							<span className='visually-hidden'>Loading...</span>
// 						</Spinner>
// 					</div>
// 				)}
// 			</div>
// 		);
// 	}
// }

export default Device;

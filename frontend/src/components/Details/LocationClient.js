import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Modal from "react-modal";
import Form from "react-bootstrap/Form";
import EditClient from "../Clients/EditClient";
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

class LocationClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clients: [],
			dataEmpty: false,
			nameSpace: window.location.href.split("/")[5],
			location: "",
			showEditModal: false,
			editClient: {},
			searchName: "",
		};
	}

	componentDidMount() {
		this.setState({ location: this.state.nameSpace.replace("$", " ") });
		this.feachClients();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachClients();
	}

	async feachClients() {
		const id = window.location.href.split("/")[4];

		axios
			.get(`${process.env.REACT_APP_API_URL}location-client/` + id)
			.then((res) => {
				const clients = res.data;
				this.setState({ dataEmpty: true });
				this.setState({ clients });
			});
	}

	async deleteClient(id) {
		const clients = [...this.state.clients].filter(
			(client) => client.id !== id
		);
		axios.delete(`${process.env.REACT_APP_API_URL}client/` + id).then((res) => {
			this.setState({ clients });
		});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async editClient(client) {
		const id = client.id;
		await axios.put(`${process.env.REACT_APP_API_URL}client/` + id, client);

		const clients = [...this.state.clients];
		if (id >= 0) {
			clients[id] = client;
			this.setState({ clients });
			this.toggleModal();
		}
	}

	editClientHandler(client) {
		this.toogleModal();
		this.setState({ editClient: client });
	}

	render() {
		let table;
		if (this.state.clients.length !== 0) {
			table = (
				<>
					<h1 className='header'>Clients in {this.state.location}</h1>
					<div className='buttonsOverTable'>
						<Form.Group controlId='validationCustomName'>
							<Form.Control
								type='text'
								className='searchInput'
								placeholder='Name'
								name='name'
								value={this.state.searchName}
								required
								onChange={(e) => {
									this.setState({ searchName: e.target.value });
								}}
							/>
						</Form.Group>
					</div>
					<Modal isOpen={this.state.showEditModal} contentLabel='Edit client'>
						<EditClient
							name={this.state.editClient.name_client}
							ip={this.state.editClient.ip_client}
							location={this.state.editClient.id_location}
							params={this.state.editClient.params}
							config={this.state.editClient.config}
							id={this.state.editClient.id}
							onCancel={() => this.toogleModal()}
							onEdit={(client) => this.editClient(client)}
						/>
					</Modal>
					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Ip</th>
								<th>date activity</th>
								<th>Config</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.clients
								.filter((value) => {
									if (this.state.searchName === "all") {
										return value;
									} else if (
										value["name_client"].includes(this.state.searchName)
									) {
										return value;
									}
								})
								.map((client) => {
									let date_config = "";

									if (client.date_config !== null) {
										const dConfig = new Date(client.date_config);
										date_config = formatDate(dConfig);
									}
									return (
										<tr key={client.id}>
											<td>{client.name_client}</td>
											<td>{client.ip_client}</td>
											<td>{date_config}</td>
											<td>{client.config}</td>
											<td>
												<AiIcons.AiFillEdit
													title='edit'
													className='icon-table'
													onClick={(key) => {
														this.editClientHandler(client);
													}}
												/>

												<AiIcons.AiFillDelete
													title='delete'
													className='icon-table'
													onClick={(key) => this.deleteClient(client.id)}
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
				<h1 className='noElement'>No clients in {this.state.location}</h1>
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

export default LocationClient;

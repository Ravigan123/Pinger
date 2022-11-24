import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-modal";
import EditClient from "./EditClient";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
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

class Client extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clients: [],
			dataEmpty: false,
			showEditModal: false,
			editClient: {},
		};
	}

	componentDidMount() {
		this.feachLocations();
		Modal.setAppElement("body");
	}

	componentWillUnmount() {
		this.feachLocations();
	}

	async feachLocations() {
		axios.get(`${process.env.REACT_APP_API_URL}client`).then((res) => {
			const clients = res.data;
			this.state.dataEmpty = true;
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
					<h1 className='header'>Clients</h1>
					<a className='float-end' href='/client/create'>
						<Button className='bnt-action'>Add</Button>
					</a>
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
					<Table hover>
						<thead>
							<tr>
								<th>Location</th>
								<th>Name</th>
								<th>Hash</th>
								<th>Ip</th>
								<th>Date activity</th>
								<th>Current config</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.clients.map((client) => {
								const d = new Date(client.date_config);
								const date_config = formatDate(d);
								const nameNoSpace = client.name_client.replace(" ", "$");
								return (
									<tr key={client.id}>
										<td>{client.name_location}</td>
										<td>{client.name_client}</td>
										<td>{client.hash_client}</td>
										<td>{client.ip_client}</td>
										<td>{date_config}</td>
										<td>{client.config}</td>
										<td>
											<a
												title='devices'
												href={
													"/client-device/" + client.id + "/" + nameNoSpace
												}>
												<AiIcons.AiTwotoneVideoCamera className='icon-table' />
											</a>

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
				<>
					<h1 className='noElement'>No clients</h1>
					<a className='float-end' href='/client/create'>
						<Button className='bnt-action'>Add</Button>
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

export default Client;

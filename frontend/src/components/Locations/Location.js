import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-modal";
import EditLocation from "./EditLocation";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";

class Location extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			dataEmpty: false,
			showEditModal: false,
			editLocation: {},
			searchLocation: "",
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
		axios.get(`${process.env.REACT_APP_API_URL}location`).then((res) => {
			const locations = res.data;
			this.state.dataEmpty = true;
			this.setState({ locations });
		});
	}

	async deleteLocation(id) {
		const locations = [...this.state.locations].filter(
			(location) => location.id !== id
		);
		axios
			.delete(`${process.env.REACT_APP_API_URL}location/` + id)
			.then((res) => {
				this.setState({ locations });
			});
	}

	toogleModal() {
		this.setState({ showEditModal: !this.state.showEditModal });
	}

	async editLocation(location) {
		const id = location.id;
		await axios.put(`${process.env.REACT_APP_API_URL}location/` + id, location);

		const locations = [...this.state.locations];
		if (id >= 0) {
			locations[id] = location;
			this.setState({ locations });
			this.toggleModal();
		}
	}

	editLocationHandler(location) {
		this.toogleModal();
		this.setState({ editLocation: location });
	}

	render() {
		let table;
		if (this.state.locations.length !== 0) {
			table = (
				<>
					<h1 className='header'>Locations {this.state.locations["count"]}</h1>
					<div className='buttonsOverTable'>
						<Form.Group controlId='validationCustomName'>
							<Form.Control
								type='text'
								className='searchInput'
								placeholder='Name'
								name='name'
								value={this.state.searchLocation}
								required
								onChange={(e) => {
									this.setState({ searchLocation: e.target.value });
								}}
							/>
						</Form.Group>
						<a className='float-end' href='/location/create'>
							<Button className='bnt-action'>Add</Button>
						</a>
					</div>
					<Modal isOpen={this.state.showEditModal} contentLabel='Edit location'>
						<EditLocation
							name={this.state.editLocation.name_location}
							ip={this.state.editLocation.ip_location}
							hash={this.state.editLocation.hash_location}
							id={this.state.editLocation.id}
							onCancel={() => this.toogleModal()}
							onEdit={(location) => this.editLocation(location)}
						/>
					</Modal>
					<Table className='mt-5' hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Hash</th>
								<th>Ip</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.locations
								.filter((value) => {
									if (this.state.searchLocation === "all") {
										return value;
									} else if (
										value["name_location"].includes(this.state.searchLocation)
									) {
										return value;
									}
								})
								.map((location) => {
									const nameNoSpace = location.name_location.replace(" ", "$");

									return (
										<tr key={location.id}>
											<td>{location.name_location}</td>
											<td>{location.hash_location}</td>
											<td>{location.ip_location}</td>
											<td>
												<a
													title='clients'
													href={
														"/location-client/" +
														location.id +
														"/" +
														nameNoSpace
													}>
													<FaIcons.FaUserAlt className='icon-table' />
												</a>
												<a
													title='devices'
													href={
														"/location-device/" +
														location.id +
														"/" +
														nameNoSpace
													}>
													<AiIcons.AiTwotoneVideoCamera className='icon-table' />
												</a>

												<AiIcons.AiFillEdit
													title='edit'
													className='icon-table'
													onClick={(key) => {
														this.editLocationHandler(location);
													}}
												/>

												<AiIcons.AiFillDelete
													title='delete'
													className='icon-table'
													onClick={(key) => this.deleteLocation(location.id)}
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
					<h1 className='noElement'>No locations</h1>
					<a className='float-end' href='/location/create'>
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

export default Location;

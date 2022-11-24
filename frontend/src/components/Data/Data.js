import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class Data extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			dataEmpty: false,
		};
	}

	componentDidMount() {
		this.feachLocations();
	}

	componentWillUnmount() {
		this.feachLocations();
	}

	async feachLocations() {
		axios
			.get(`${process.env.REACT_APP_API_URL}location-dashboard`)
			.then((res) => {
				const locations = res.data;
				this.state.dataEmpty = true;
				this.setState({ locations });
			});
	}

	render() {
		let table;
		if (this.state.locations.length !== 0) {
			table = (
				<>
					<h1 className='header'>Dashboard</h1>
					<a className='float-end' href='/location/create'>
						<Button className='bnt-action'>Add</Button>
					</a>
					<Table hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Ip</th>
								<th>Devices</th>
								<th>Error</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.locations.map((location) => {
								const nameNoSpace = location.name_location.replace(" ", "$");
								return (
									<tr key={location.id}>
										<td>{location.name_location}</td>
										<td>{location.ip_location}</td>
										<td>{location.dev_all}</td>
										<td>{location.dev_err}</td>
										<td>
											<a
												title='clients'
												href={
													"/location-client/" + location.id + "/" + nameNoSpace
												}>
												<FaIcons.FaUserAlt className='icon-table' />
											</a>
											<a
												title='devices'
												href={
													"/location-device/" + location.id + "/" + nameNoSpace
												}>
												<AiIcons.AiTwotoneVideoCamera className='icon-table' />
											</a>
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

export default Data;

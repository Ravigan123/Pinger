import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditClient(props) {
	const [name, setName] = useState(props.name);
	const [changedName, setchangedName] = useState(false);
	const [changedLocation, setChangedLocation] = useState(false);
	const [ip, setIp] = useState(props.ip);
	const [config, setConfig] = useState(props.config === 1 ? true : false);
	const [params, setParams] = useState(props.params);
	const [errors, setErrors] = useState({});
	const [location, setLocation] = useState(props.location);
	const [locations, setlocations] = useState([]);

	useEffect(() => {
		feachLocations();
	}, []);

	async function feachLocations() {
		axios
			.get(`${process.env.REACT_APP_API_URL}getLocationSelect`)
			.then((res) => {
				const locations = res.data;
				setlocations(locations);
			});
	}

	async function validclient(client) {
		const id = client.id;
		let err;
		try {
			await axios.put(`${process.env.REACT_APP_API_URL}client/` + id, client);
		} catch (error) {
			err = error.response.data.message;
		}
		return err;
	}

	const handleName = (event) => {
		setName(event.target.value);
		setchangedName(true);
		if (!!errors[name])
			setErrors({
				...errors,
				[name]: null,
			});
	};
	const handleLocation = (event) => {
		setLocation(event.target.value);
		setChangedLocation(true);
	};

	const handleIp = (event) => {
		setIp(event.target.value);
	};

	const handleParams = (event) => {
		setParams(event.target.value);
	};

	const handleChange = (config) => {
		setConfig(!config);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid !== undefined) newErrors.name = backandValid;

		return newErrors;
	};

	async function EditClient(e) {
		e.preventDefault();
		let enabled;
		if (config === true) enabled = 1;
		else enabled = 0;
		const client = {
			id: props.id,
			id_location: location,
			name_client: name,
			ip_client: ip,
			config: enabled,
			params,
			changedName,
			changedLocation,
		};

		const backendValid = await validclient(client);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-5'>
			<h1 className='header'>Edit client</h1>
			<Form onSubmit={EditClient} className='mt-5'>
				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleLocation}
					className='mb-3'
					value={location}>
					<option disabled>Location</option>
					{locations.map((loc) => {
						return (
							<option key={loc.id} value={loc.id}>
								{loc.name_location}
							</option>
						);
					})}
				</Form.Select>

				<Form.Group controlId='validationCustomName'>
					<FloatingLabel controlId='floatingName' label='Name' className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Name'
							name='name'
							value={name}
							required
							isInvalid={!!errors.name}
							onChange={handleName}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.name}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomIp'>
					<FloatingLabel controlId='floatingIp' label='Ip' className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Ip'
							name='ip'
							value={ip}
							required
							isInvalid={!!errors.ip}
							onChange={handleIp}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.ip}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomParams'>
					<FloatingLabel
						controlId='floatinghash'
						label='Params'
						className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Params'
							name='params'
							value={params}
							isInvalid={!!errors.params}
							onChange={handleParams}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.parmas}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group className='mb-3' controlId='formBasicCheckbox'>
					<Form.Check
						type='checkbox'
						label='Config'
						name='config'
						checked={config}
						onChange={() => handleChange(config)}
					/>
				</Form.Group>

				<Button className='float-end Formmargin bnt-action' type='submit'>
					Edit
				</Button>
				<Button
					className='float-end'
					variant='danger'
					onClick={() => {
						props.onCancel();
					}}>
					Cancel
				</Button>
			</Form>
		</Container>
	);
}

export default EditClient;

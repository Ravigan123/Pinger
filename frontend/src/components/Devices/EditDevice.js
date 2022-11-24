import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditDevice(props) {
	const [name, setName] = useState(props.name);
	const [changedName, setchangedName] = useState(false);
	const [changedLocation, setChangedLocation] = useState(false);
	const [ip, setIp] = useState(props.ip);
	const [location, setLocation] = useState(props.location);
	const [type, setType] = useState(props.type);
	const [params, setParams] = useState(props.params);
	const [errors, setErrors] = useState({});
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

	async function validDevice(device) {
		const id = device.id;
		let err;
		try {
			await axios.put(`${process.env.REACT_APP_API_URL}device/` + id, device);
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

	const handleType = (event) => {
		setType(event.target.value);
	};
	const handleParams = (event) => {
		setParams(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid !== undefined) newErrors.name = backandValid;

		return newErrors;
	};

	async function editDevice(e) {
		e.preventDefault();

		const device = {
			id: props.id,
			name_device: name,
			id_location: location,
			ip_device: ip,
			type,
			params,
			changedName,
			changedLocation,
		};

		const backendValid = await validDevice(device);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-3 '>
			<h1>Edit Device</h1>
			<Form onSubmit={editDevice}>
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

				<Form.Group>
					<FloatingLabel controlId='floatingIp' label='ip' className='mb-3'>
						<Form.Control
							type='text'
							placeholder='Ip'
							name='ip'
							value={ip}
							isInvalid={!!errors.ip}
							onChange={handleIp}
						/>
					</FloatingLabel>
				</Form.Group>

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleType}
					className='mb-3'
					value={type}>
					<option disabled value='null'>
						Type
					</option>
					<option value='camera'>camera</option>
					<option value='server'>server</option>
				</Form.Select>

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

export default EditDevice;

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function ManyDevice() {
	const [name, setName] = useState("");
	const [ip, setIp] = useState("");
	const [type, setType] = useState("");
	const [location, setLocation] = useState("");
	const [params, setParams] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [size, setSize] = useState("");
	const [errors, setErrors] = useState({});
	const [locations, setlocations] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		feachLocations();
	});

	async function feachLocations() {
		axios
			.get(`${process.env.REACT_APP_API_URL}getLocationSelect`)
			.then((res) => {
				const locations = res.data;
				setlocations(locations);
			});
	}

	async function addToBase(device) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}device-many`, device);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	const handleName = (event) => {
		setName(event.target.value);
		if (!!errors[name])
			setErrors({
				...errors,
				[name]: null,
			});
	};
	const handleLocation = (event) => {
		setLocation(event.target.value);
	};

	const handleType = (event) => {
		setType(event.target.value);
	};

	const handleParams = (event) => {
		setParams(event.target.value);
	};

	const handleIp = (event) => {
		setIp(event.target.value);
	};

	const handleFrom = (event) => {
		setFrom(event.target.value);
	};
	const handleTo = (event) => {
		setTo(event.target.value);
	};
	const handleSize = (event) => {
		setSize(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;

		if (backandValid === "The given device already exists")
			newErrors.name = backandValid;

		if (backandValid === "Location cannot be empty")
			newErrors.location = backandValid;

		if (backandValid === "Name pattern must contain $")
			newErrors.name = backandValid;

		if (backandValid === "Ip pattern must contain $")
			newErrors.ip = backandValid;

		if (backandValid === "Type cannot be empty") newErrors.type = backandValid;
		if (backandValid === "To must be greater than From or equal")
			newErrors.to = backandValid;

		return newErrors;
	};

	async function addDevice(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;
		if (location === "") {
			const err = "Location cannot be empty";
			formErrors = validateForm(err);
		} else if (type === "") {
			const err = "Type cannot be empty";
			formErrors = validateForm(err);
		} else if (!name.includes("$")) {
			const err = "Name pattern must contain $";
			formErrors = validateForm(err);
		} else if (!ip.includes("$")) {
			const err = "Ip pattern must contain $";
			formErrors = validateForm(err);
		} else if (from > to) {
			const err = "To must be greater than From or equal";
			formErrors = validateForm(err);
		} else {
			const device = {
				name_pattern: name,
				id_location: location,
				ip_pattern: ip,
				type,
				params,
				size,
				from,
				to,
			};
			backandValid = await addToBase(device);
			formErrors = validateForm(backandValid);
		}
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/device");
	}

	return (
		<Container className='mt-5'>
			<h1 className='header'>Add device</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}

			<Form onSubmit={addDevice} className='mt-5'>
				{errors.location !== undefined && (
					<Alert variant='danger'>{errors.location}</Alert>
				)}
				{errors.type !== undefined && (
					<Alert variant='danger'>{errors.type}</Alert>
				)}

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleLocation}
					className='mb-3'
					defaultValue='null'>
					<option value='null' disabled>
						Location
					</option>
					{locations.map((loc) => {
						return (
							<option key={loc.id} value={loc.id}>
								{loc.name_location}
							</option>
						);
					})}
				</Form.Select>

				<Form.Group controlId='validationCustomName'>
					<FloatingLabel
						controlId='floatingName'
						label='Name (add $ in right place)'
						className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Pattern name'
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
					<FloatingLabel
						controlId='floatingIp'
						label='Ip (add $ in right place)'
						className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Pattern ip'
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

				<Form.Select
					size='lg'
					aria-label='Default select example'
					onChange={handleType}
					className='mb-3'
					defaultValue={"null"}>
					<option disabled value='null'>
						Type
					</option>
					<option value='camera'>camera</option>
					<option value='server'>server</option>
				</Form.Select>

				<Form.Group controlId='validationCustomSize'>
					<FloatingLabel controlId='floatinghash' label='Size' className='mb-3'>
						<Form.Control
							className='inputs'
							type='number'
							placeholder='Size'
							name='size'
							value={size}
							min='1'
							required
							isInvalid={!!errors.size}
							onChange={handleSize}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.size}
						</Form.Control.Feedback>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomFrom'>
					<FloatingLabel controlId='floatinghash' label='From' className='mb-3'>
						<Form.Control
							className='inputs'
							type='number'
							placeholder='From'
							name='from'
							value={from}
							required
							onChange={handleFrom}
						/>
					</FloatingLabel>
				</Form.Group>

				<Form.Group controlId='validationCustomTo'>
					<FloatingLabel controlId='floatinghash' label='To' className='mb-3'>
						<Form.Control
							className='inputs'
							type='number'
							placeholder='To'
							name='to'
							value={to}
							required
							isInvalid={!!errors.to}
							onChange={handleTo}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.to}
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

				<Button className='float-end bnt-action' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default ManyDevice;

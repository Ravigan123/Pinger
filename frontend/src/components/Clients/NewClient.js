import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function Newclient() {
	const [name, setName] = useState("");
	const [ip, setIp] = useState("");
	const [config, setConfig] = useState(false);
	const [params, setParams] = useState("");
	const [errors, setErrors] = useState({});
	const [location, setLocation] = useState("");
	const [locations, setlocations] = useState([]);
	const navigate = useNavigate();

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

	async function addToBase(client) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}client`, client);
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

	const handleIp = (event) => {
		setIp(event.target.value);
	};

	const handleParams = (event) => {
		setParams(event.target.value);
	};

	const handleChange = (config) => {
		setConfig(!config);
	};

	const validateForm = (backandValid, location) => {
		const newErrors = {};
		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;

		if (backandValid === "The given client already exists")
			newErrors.name = backandValid;

		if (location === "") newErrors.location = "Location cannot be empty";

		return newErrors;
	};

	async function addclient(e) {
		e.preventDefault();
		let enabled;
		if (config === true) enabled = 1;
		else enabled = 0;
		const client = {
			name_client: name,
			id_location: location,
			ip_client: ip,
			params,
			enabled,
		};
		const backandValid = await addToBase(client);
		const formErrors = validateForm(backandValid, client["id_location"]);

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate("/client");
	}

	return (
		<Container className='mt-5'>
			<h1 className='header'>Add client</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}

			<Form onSubmit={addclient} className='mt-5'>
				{errors.location !== undefined && (
					<Alert variant='danger'>{errors.location}</Alert>
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
						onChange={() => handleChange(config)}
					/>
				</Form.Group>

				<Button className='float-end bnt-action' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default Newclient;

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function NewLocation() {
	const [name, setName] = useState("");
	const [hash, setHash] = useState("");
	const [ip, setIp] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	async function addToBase(location) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}location`, location);
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
	const handleHash = (event) => {
		setHash(event.target.value);
	};
	const handleIp = (event) => {
		setIp(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};
		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;
		if (backandValid === "The given name already exists")
			newErrors.name = backandValid;
		if (backandValid === "The given hash already exists")
			newErrors.hash = backandValid;

		return newErrors;
	};

	async function addLocation(e) {
		e.preventDefault();

		const location = {
			name_location: name,
			hash_location: hash,
			ip_location: ip,
		};

		const backandValid = await addToBase(location);
		const formErrors = validateForm(backandValid);

		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate(-1);
	}

	return (
		<Container className='mt-5'>
			<h1 className='header'>Add location</h1>
			{errors.server !== undefined && (
				<Alert variant='danger'>{errors.server}</Alert>
			)}

			<Form onSubmit={addLocation} className='mt-5'>
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

				<Form.Group controlId='validationCustomHash'>
					<FloatingLabel controlId='floatinghash' label='Hash' className='mb-3'>
						<Form.Control
							className='inputs'
							type='text'
							placeholder='Hash'
							name='hash'
							value={hash}
							required
							isInvalid={!!errors.hash}
							onChange={handleHash}
						/>
						<Form.Control.Feedback type='invalid'>
							{errors.hash}
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

				<Button className='float-end bnt-action' type='submit'>
					Add
				</Button>
			</Form>
		</Container>
	);
}

export default NewLocation;

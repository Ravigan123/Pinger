import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";

function EditLocation(props) {
	const [name, setName] = useState(props.name);
	const [hash, setHash] = useState(props.hash);
	const [changedName, setchangedName] = useState(false);
	const [changedHash, setchangedHash] = useState(false);
	const [ip, setIp] = useState(props.ip);
	const [errors, setErrors] = useState({});

	async function validLocation(location) {
		const id = location.id;
		let err;
		try {
			await axios.put(
				`${process.env.REACT_APP_API_URL}location/` + id,
				location
			);
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
	const handleHash = (event) => {
		setHash(event.target.value);
		setchangedHash(true);
		if (!!errors[name])
			setErrors({
				...errors,
				[name]: null,
			});
	};

	const handleIp = (event) => {
		setIp(event.target.value);
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid === "The given name already exists")
			newErrors.name = backandValid;
		if (backandValid === "The given hash already exists")
			newErrors.hash = backandValid;

		return newErrors;
	};

	async function editLocation(e) {
		e.preventDefault();

		const location = {
			id: props.id,
			name_location: name,
			hash_location: hash,
			ip_location: ip,
			changedName,
			changedHash,
		};

		const backendValid = await validLocation(location);
		const formErrors = validateForm(backendValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else {
			window.location.reload(false);
			props.onCancel();
		}
	}

	return (
		<Container className='mt-5'>
			<h1 className='header'>Edit location</h1>
			<Form onSubmit={editLocation} className='mt-5'>
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

export default EditLocation;

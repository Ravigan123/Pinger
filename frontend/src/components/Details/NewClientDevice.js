import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

function NewClientDevice() {
	const client = window.location.href.split("/")[5].split("?")[0];
	const [clientName, setClientName] = useState(
		window.location.href.split("/")[6]
	);
	const [errors, setErrors] = useState({});
	const [devices, setDevices] = useState([]);
	const [isCheckAll, setIsCheckAll] = useState(false);
	const [dataEmpty, setDataEmpty] = useState(false);
	const [isCheck, setIsCheck] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		feachDevices();
	}, []);

	async function feachDevices() {
		await axios
			.get(`${process.env.REACT_APP_API_URL}client/device/` + client)
			.then((res) => {
				const devices = res.data;
				const nameSpace = clientName.replace("$", " ");

				setClientName(nameSpace);
				setDevices(devices);
				setDataEmpty(true);
			});
	}

	async function addToBase(device) {
		let err;
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}client-device`, device);
		} catch (error) {
			if (error.response.data === undefined)
				err = "No connection to the server";
			else err = error.response.data.message;
		}
		return err;
	}

	const handleCheck = (e) => {
		const { id, checked } = e.target;
		setIsCheck([...isCheck, parseInt(id)]);
		if (!checked) {
			setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
		}
	};

	const handleCheckAll = (e) => {
		setIsCheckAll(!isCheckAll);
		setIsCheck(devices.map((dev) => dev.id));
		if (isCheckAll) {
			setIsCheck([]);
		}
	};

	const validateForm = (backandValid) => {
		const newErrors = {};

		if (backandValid === "No connection to the server")
			newErrors.server = backandValid;

		if (backandValid === "The given device already exists")
			newErrors.name = backandValid;

		if (backandValid === "device cannot be empty")
			newErrors.device = backandValid;

		if (backandValid === "Type cannot be empty") newErrors.type = backandValid;

		return newErrors;
	};

	async function addDevice(e) {
		e.preventDefault();
		let formErrors;
		let backandValid;
		let result = [];

		for (let i = 0; i < isCheck.length; i++) {
			let newDev = {};
			newDev["id_device"] = isCheck[i];
			newDev["id_client"] = client;
			result.push(newDev);
		}

		backandValid = await addToBase(result);
		formErrors = validateForm(backandValid);
		if (Object.keys(formErrors).length > 0) setErrors(formErrors);
		else navigate(-1);
	}

	let content;

	if (devices.length !== 0) {
		content = (
			<>
				<h1 className='header'>Add device to client {clientName}</h1>
				{errors.server !== undefined && (
					<Alert variant='danger'>{errors.server}</Alert>
				)}
				<Form onSubmit={addDevice} className='mt-5'>
					{errors.device !== undefined && (
						<Alert variant='danger'>{errors.device}</Alert>
					)}
					{errors.type !== undefined && (
						<Alert variant='danger'>{errors.type}</Alert>
					)}
					<Button className='float-end bnt-action' type='submit'>
						Add
					</Button>

					<Form.Group className='mb-3' controlId='formBasicCheckbox'>
						<Form.Check
							className='deviceCheck'
							type='checkbox'
							label='All'
							name='all'
							onChange={handleCheckAll}
							checked={isCheckAll}
						/>
						{devices.map((dev) => {
							return (
								<Form.Check
									className='deviceCheck'
									key={dev.id}
									id={dev.id}
									type='checkbox'
									label={dev.name_device}
									name={dev.name_device}
									onChange={handleCheck}
									checked={isCheck.includes(dev.id)}
								/>
							);
						})}
					</Form.Group>
				</Form>
			</>
		);
	} else {
		content = <h1 className='noElement'>No devices to add </h1>;
	}

	return (
		<div>
			{dataEmpty ? (
				<Container className='mt-4'>{content}</Container>
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

export default NewClientDevice;

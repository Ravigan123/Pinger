import React, { useState } from "react";
import Location from "./components/Locations/Location";
import NavBar from "./components/Navbar/navBar";
import NewLocation from "./components/Locations/NewLocation";
import Data from "./components/Data/Data";
import Device from "./components/Devices/Device";
import NewDevice from "./components/Devices/NewDevice";
import ManyDevice from "./components/Devices/ManyDevice";
import Client from "./components/Clients/Client";
import NewClient from "./components/Clients/NewClient";
import LocationClient from "./components/Details/LocationClient";
import LocationDevice from "./components/Details/LocationDevice";
import ClientDevice from "./components/Details/ClientDevice";
import NewClientDevice from "./components/Details/NewClientDevice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
	const [navVisible, showNavbar] = useState(true);

	return (
		<>
			<Router>
				<div className='App'>
					<NavBar visible={navVisible} show={showNavbar} />
					<Routes>
						<Route
							path='/'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<Data />
								</div>
							}
						/>
						<Route
							path='/location'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<Location />
								</div>
							}
						/>
						<Route
							path='/location/create'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<NewLocation />
								</div>
							}
						/>
						<Route
							path='/device'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<Device />
								</div>
							}
						/>
						<Route
							path='/device/create'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<NewDevice />
								</div>
							}
						/>
						<Route
							path='/device/many'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<ManyDevice />
								</div>
							}
						/>
						<Route
							path='/client'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<Client />
								</div>
							}
						/>
						<Route
							path='/client/create'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<NewClient />
								</div>
							}
						/>
						<Route
							path='/location-client/:id/:location'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<LocationClient />
								</div>
							}
						/>
						<Route
							path='/location-device/:id/:location'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<LocationDevice />
								</div>
							}
						/>
						<Route
							path='/client-device/:id/:location'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<ClientDevice />
								</div>
							}
						/>
						<Route
							path='/client-device/create/:id/:client'
							element={
								<div className={!navVisible ? "page" : "page-with-navbar"}>
									<NewClientDevice />
								</div>
							}
						/>
						{/* <Route path='/location' element={<Location />} />
					<Route path='/location/create' element={<NewLocation />} />
					<Route path='/device' element={<Device />} />
					<Route path='/device/create' element={<NewDevice />} />
					<Route path='/type' element={<Type />} />
					<Route path='/receiver' element={<Receiver />} />
					<Route path='/receiver/create' element={<NewReceiver />} />
					<Route path='/alert' element={<Alert />} /> */}
					</Routes>
				</div>
			</Router>
			{/* <div
				className='text-center p-4 footer'
				style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
				<p> Copyright © WamaSoft {year} </p>
			</div> */}
		</>
	);
}

export default App;

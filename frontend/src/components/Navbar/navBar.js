import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "./Navbar.css";
import { IconContext } from "react-icons";

function Navbar({ visible, show }) {
	return (
		<>
			<IconContext.Provider value={{ color: "#fff" }}>
				<div className='navbar'>
					<Link to='#' className='menu-bars'>
						<FaIcons.FaBars onClick={() => show(!visible)} />
					</Link>
				</div>
				<nav className={visible ? "nav-menu active" : "nav-menu"}>
					<ul className='nav-menu-items'>
						<li className='navbar-toggle'>
							<Link to='#' className='menu-bars' onClick={() => show(!visible)}>
								<AiIcons.AiOutlineClose />
							</Link>
						</li>
						{SidebarData.map((item, index) => {
							return (
								<li key={index} className={item.cName}>
									<Link to={item.path}>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</IconContext.Provider>
		</>
	);
}

export default Navbar;

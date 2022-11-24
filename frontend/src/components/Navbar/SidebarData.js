import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
	{
		title: "Dashboard",
		path: "/",
		icon: <AiIcons.AiFillHome />,
		cName: "nav-text",
	},
	{
		title: "Locations",
		path: "/location",
		icon: <FaIcons.FaRegBuilding />,
		cName: "nav-text",
	},
	{
		title: "Devices",
		path: "/device",
		icon: <AiIcons.AiOutlineVideoCamera />,
		cName: "nav-text",
	},
	{
		title: "Clients",
		path: "/client",
		icon: <AiIcons.AiOutlineUser />,
		cName: "nav-text",
	},
];

import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';

import styles from './index.module.css';

export default function Login() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [warning, setWarning] = useState("");

	const onLogin = async () => {
		try {
			let res = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/auth/login/`,
				{
					username: username,
					password: password
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json'
					},
				}
			);
			setIsLoggedIn(true);
		}
		catch (err) {
			setWarning(err.response.data);
		}
	};

	if (isLoggedIn === false) {
		return (
			<div className={styles["Container-Outer"]}>
				<div className={styles.Container}>
					<div className={styles.Head}>
						Login
					</div>
					<div className={styles["Input-Section"]}>
						Username
						<input className={styles.Input} type="text" onChange={(e)=>{
							setUsername(e.target.value);
						}}/>
					</div>
					<div className={styles["Input-Section"]}>
						Password
						<input className={styles.Input} type="password" onChange={(e)=>{
							setPassword(e.target.value);
						}}/>
					</div>
					<div className={styles["Input-Section"]}>
						<div className={styles.Warning}>
							{warning}
						</div>
						<button className={styles.Button} onClick={()=>{ onLogin(); }}>
							Login
						</button>
					</div>
					<Link className={styles.Register} to="/register">
						Don't have an account?
					</Link>
				</div>
			</div>
		);
	}
	else {
		return (
			<Redirect to="/dashboard"/>
		);
	}

}
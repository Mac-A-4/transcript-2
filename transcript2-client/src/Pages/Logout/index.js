import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';

import styles from './index.module.css';

export default function Logout() {

	const [isLoggedOut, setIsLoggedOut] = useState(false);

	useEffect(() => {
		const requestLogOut = async () => {
			const res = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/auth/release`, "", { withCredentials: true });
			setIsLoggedOut(true);
		};
		requestLogOut();
	}, []);

	if (isLoggedOut === false) {
		return (
			<div className={styles.Logout}>
				<Loader/>
			</div>
		);
	}
	else {
		return (
			<Redirect to="/login"/>
		);
	}

}
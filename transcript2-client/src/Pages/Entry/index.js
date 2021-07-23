import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';

import styles from './index.module.css';

export default function Entry() {

	const [isLoggedIn, setIsLoggedIn] = useState(null);

	useEffect(() => {
		const requestIsLoggedIn = async () => {
			const res = await axios.get(`https://api.rivendelltranscript.com/auth/check/`, { withCredentials: true });
			setIsLoggedIn(res.data);
		};
		requestIsLoggedIn();
	}, []);

	if (isLoggedIn === null) {
		return (
			<div className={styles.Entry}>
				<Loader/>
			</div>
		);
	}
	else if (isLoggedIn === true) {
		return (
			<Redirect to="/dashboard"/>
		);
	}
	else if (isLoggedIn === false) {
		return (
			<Redirect to="/login"/>
		);
	}

}
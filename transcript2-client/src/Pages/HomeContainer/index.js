import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

import styles from './index.module.css';

export default function HomeContainer(props) {

	const [redirect, setRedirect] = useState(null);

	if (redirect === null) {
		return (
			<div className={styles.Container}>
				<div className={styles.Top}>
					<div>
						<Link to="/dashboard">
							<button className={styles.Button}>
								Dashboard
							</button>
						</Link>
						<Link to="/logout">
							<button className={styles.Button}>
								Logout
							</button>
						</Link>
					</div>
					<div className={styles.Name}>
						Rivendell Transcript
					</div>
				</div>
				<div className={styles.Bottom}>
					{props.children}
				</div>
			</div>
		);
	}
	else {
		return (
			<Redirect to={redirect}/>
		);
	}

}
import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';
import HomeContainer from '../HomeContainer';

import styles from './index.module.css';

function AddOverlay(props) {

	const [ name, setName ] = useState("");

	if (props.show) {
		return (
			<div className={styles.OverlayContainer}>
				<div className={styles.InnerOverlay}>
					<div className={styles.OverlayTop}>
						New transcript name?
					</div>
					Name
					<input className={styles.Input} type="text" onChange={(e)=>{ setName(e.target.value); }}/>
					<div className={styles.OverlayControls}>
						<button className={styles.Button} onClick={ ()=>{ props.onSubmit(name); } }>
							Create
						</button>
						<button className={styles.Button} onClick={ ()=>{ props.onCancel(); } }>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}
	else {
		return null;
	}

}

function DeleteOverlay(props) {

	if (props.show) {
		return (
			<div className={styles.OverlayContainer}>
				<div className={styles.InnerOverlay}>
					<div className={styles.OverlayTop}>
						Are you sure you want to delete?
					</div>
					<div className={styles.DeleteName}>
						Transcript: "{props.name}"
					</div>
					<div className={styles.OverlayControls}>
						<button className={styles.Button} onClick={ ()=>{ props.onSubmit(); } }>
							Delete
						</button>
						<button className={styles.Button} onClick={ ()=>{ props.onCancel(); } }>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}
	else {
		return null;
	}

}

function getDefaultSave() {
	return JSON.stringify({
		"Student Information": {
			"Name": "",
			"Date of Birth": "",
			"Graduation Date": "",
			"Gender": "",
			"Address Line 1": "",
			"Address Line 2": "",
			"City": "",
			"State": "",
			"Zip Code": "",
			"Phone": "",
			"Email": "",
			"Parent/Guardian(s)": ""
		},
		"School Information": {
			"School Name": "",
			"Address Line 1": "",
			"Address Line 2": "",
			"City": "",
			"State": "",
			"Zip Code": "",
			"School Phone": "",
			"School Email": "",
			"Administrator Name": ""
		},
		"Student Coursework": [
			/*
				{
					"Subject Name": "",
					"Course List": []
				}
			*/
		],
		"Grading Scale": {
			"Extended": false,
			"A": "4.0",
			"A+": "4.3",
			"A-": "3.7",
			"B": "3.0",
			"B+": "3.3",
			"B-": "2.7",
			"C": "2.0",
			"C+": "2.3",
			"C-": "1.7",
			"D": "1.0",
			"D+": "1.3"
		},
		"Notes": ""
	});
}

function List() {

	const [ redirect, setRedirect ] = useState(null);
	const [ list, setList ] = useState(null);
	const [ showAdd, setShowAdd ] = useState(false);
	const [ showDelete, setShowDelete ] = useState(false);
	const [ deleteName, setDeleteName ] = useState("");

	const refreshListAsync = async () => {
		setList(null);
		const res = await axios.get(`${window.location.protocol}//${window.location.hostname}:8080/save/enum/`, { withCredentials: true });
		setList(res.data);
	};
	
	const refreshList = () => {
		refreshListAsync();
	};

	useEffect(() => {
		refreshList();
	}, []);

	const onAddAsync = async (name) => {
		const res = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/save/create/`,
			{
				name: name,
				value: getDefaultSave()
			},
			{
				withCredentials: true
			}
		);
		await refreshListAsync();
	};

	const onAdd = (name) => {
		onAddAsync(name);
	};

	const onDeleteAsync = async (name) => {
		const res = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/save/delete/`,
			{
				name: name
			},
			{
				withCredentials: true
			}
		);
		await refreshListAsync();
	};

	const onDelete = (name) => {
		onDeleteAsync(name);
	};

	if (redirect === null) {
		if (list === null) {
			return (
				<Loader/>
			);
		}
		else if (list.length == 0) {
			return (
				<div className={styles.NoneContainer}>
					<AddOverlay show={showAdd} onSubmit={(name)=>{ onAdd(name); setShowAdd(false); }} onCancel={()=>{ setShowAdd(false); }}/>
					<div className={styles.NoneTop}>
						You don't have any transcripts yet.
					</div>
					<button className={styles.Button} onClick={()=>{ setShowAdd(true); }}>
						New Transcript
					</button>
				</div>
			);
		}
		else {
			return (
				<div className={styles.LargeContainer}>
					<div className={styles.SomeContainer}>
						<AddOverlay show={showAdd} onSubmit={(name)=>{ onAdd(name); setShowAdd(false); }} onCancel={()=>{ setShowAdd(false); }}/>
						<DeleteOverlay show={showDelete} name={deleteName} onSubmit={()=>{ onDelete(deleteName); setShowDelete(false); }} onCancel={()=>{ setShowDelete(false); }}/>
						<div className={styles.SomeTop}>
							You have {list.length} transcript(s).
						</div>
						<button className={styles.Button} onClick={()=>{ setShowAdd(true); }}>
							New Transcript
						</button>
					</div>
					<div className={styles.ListContainer}>
						{list.map((x)=>{
							return (
								<div key={x} className={styles.ListEntry}>
									<div>
										{x}
									</div>
									<div>
										<Link to={`/edit/${x}`}>
											<button className={styles.Button}>
												Edit
											</button>
										</Link>
										<Link to={`/view/${x}`}>
											<button className={styles.Button}>
												View
											</button>
										</Link>
										<button className={styles.Button} onClick={()=>{ setDeleteName(x); setShowDelete(true); }}>
											Delete
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			);
		}
	}
	else {
		return (
			<Redirect to={redirect}/>
		);
	}

}

export default function Home() {

	const [ redirect, setRedirect ] = useState(null);

	if (redirect === null) {
		return (
			<HomeContainer>
				<div className={styles.Container}>
					<List/>
				</div>
			</HomeContainer>
		);
	}
	else {
		return (
			<Redirect to={redirect}/>
		);
	}

}
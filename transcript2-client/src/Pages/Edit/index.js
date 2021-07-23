import React, { useEffect, useState, useRef } from 'react';
import { Redirect, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';
import HomeContainer from '../HomeContainer';

import styles from './index.module.css';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function FieldInput(props) {
	return (
		<div className={styles.FieldInput}>
			{props.name}
			<br/>
			<input className={styles.Input} type="text" value={props.value} onChange={(e)=>{ props.onChange(e.target.value); }}/>
		</div>
	);
}

function FieldSelect(props) {
	return (
		<div className={styles.FieldInput}>
			{props.name}
			<br/>
			<select className={styles.Input} value={props.value} onChange={(e)=>{ props.onChange(e.target.value); }}>
				{props.children}
			</select>
		</div>
	);
}

function ScaleInput(props) {
	return (
		<div className={styles.ScaleInput}>
			<div className={styles.ScaleInput1}>
				{props.name}
			</div>
			=
			<div className={styles.ScaleInput2}>
				<input className={styles.Input} disabled={props.disabled} type="text" value={props.value} onChange={(e)=>{props.onChange(e.target.value);}}/>
			</div>
		</div>
	);
}

function CourseInput(props) {
	return (
		<div className={styles.CourseInput}>
			<FieldInput name="Course Name" value={props.value["Course Name"]} onChange={(x)=>{
				props.value["Course Name"] = x;
				props.onUpdate();
			}}/>
			<FieldInput name="Provider" value={props.value["Provider"]} onChange={(x)=>{
				props.value["Provider"] = x;
				props.onUpdate();
			}}/>
			<div className={styles.CourseInner}>
				<div className={styles.SmallCourse}>
					<FieldInput name="Year" value={props.value["Year"]} onChange={(x)=>{
						props.value["Year"] = x;
						props.onUpdate();
					}}/>
				</div>
				<div className={styles.SmallCourse}>
					<FieldSelect name="Type" value={props.value["Type"]} onChange={(x)=>{
						props.value["Type"] = x;
						props.onUpdate();
					}}>
						<option value=""></option>
						<option value="AP">AP</option>
						<option value="HR">HR</option>
						<option value="MS">MS</option>
						<option value="DE">DE</option>
					</FieldSelect>
				</div>
				<div className={styles.SmallCourse}>
					<FieldSelect name="Grade" value={props.value["Grade"]} onChange={(x)=>{
						props.value["Grade"] = x;
						props.onUpdate();
					}}>
						<option value="A+">A+</option>
						<option value="A">A</option>
						<option value="A-">A-</option>
						<option value="B+">B+</option>
						<option value="B">B</option>
						<option value="B-">B-</option>
						<option value="C+">C+</option>
						<option value="C">C</option>
						<option value="C-">C-</option>
						<option value="D+">D+</option>
						<option value="D">D</option>
						<option value="F">F</option>
						<option value="P">P</option>
						<option value="NP">NP</option>
						<option value="IP">IP</option>
						<option value="PL">PL</option>
					</FieldSelect>
				</div>
				<div className={styles.SmallCourse}>
					<FieldInput name="Credit" value={props.value["Credit"]} onChange={(x)=>{
						props.value["Credit"] = x;
						props.onUpdate();
					}}/>
				</div>
				<div className={styles.SmallCourse}>
					<button className={styles.Button} onClick={()=>{props.onRemove(); props.onUpdate();}}>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}

function SubjectInput(props) {

	const onNewCourse = () => {
		props.value["Student Coursework"][props.index]["Course List"].push({
			"Course Name": "",
			"Provider": "",
			"Year": "",
			"Type": "",
			"Grade": "A+",
			"Credit": "0"
		});
		props.onUpdate(props.value);
	};

	const onRemoveCourse = (i) => {
		props.value["Student Coursework"][props.index]["Course List"].splice(i, 1);
		props.onUpdate(props.value);
	};

	return (
		<div className={styles.LargeContainer}>
			<div className={styles.InnerContainer}>
				<div className={styles.SubjectInner}>
					<div className={styles.SubjectHead}>
						<div className={styles.SubjectHead1}>
							<FieldInput name="Subject Name" value={props.value["Student Coursework"][props.index]["Subject Name"]} onChange={(x)=>{
								props.value["Student Coursework"][props.index]["Subject Name"] = x;
								props.onUpdate(props.value);
							}}/>
						</div>
						<div className={styles.SubjectHead2}>
							<button className={styles.Button} onClick={()=>{ onNewCourse(); }}>
								New Course
							</button>
							<button className={styles.Button} onClick={()=>{props.onRemove(); props.onUpdate(props.value);}}>
								Remove
							</button>
						</div>
					</div>
					{props.value["Student Coursework"][props.index]["Course List"].map((x, i) => {
						return (
							<div key={i} className={styles.CourseContainer}>
								<CourseInput value={x} onUpdate={()=>{ props.onUpdate(props.value); }} onRemove={()=>{ onRemoveCourse(i); }}/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);

}

export default function Edit() {

	const { name } = useParams();
	const [ value, setValue ] = useState(null);
	const [ update, setUpdate ] = useState(0);

	const forceUpdate = () => {
		setUpdate(update + 1);
	};

	useEffect(() => {
		const requestValue = async () => {
			const res = await axios.post(`https://api.rivendelltranscript.com/save/read/`,
				{ name: name },
				{ withCredentials: true }
			);
			setValue(res.data);
		};
		requestValue();
	}, []);

	const onSaveAsync = async (show) => {
		const res = await axios.post(`https://api.rivendelltranscript.com/save/update/`,
			{ 
				name: name,
				value: JSON.stringify(value)
			},
			{ withCredentials: true }
		);
		if (show) {
			alert(res.data);
		}
	};

	useInterval(() => {
		onSaveAsync(false);
	}, 5000);

	const onSave = () => {
		onSaveAsync(true);
	};

	const onNewSubject = () => {
		value["Student Coursework"].push({
			"Subject Name": "",
			"Course List": []
		});
		forceUpdate();
	};

	const onRemoveSubject = (i) => {
		value["Student Coursework"].splice(i, 1);
		setValue(value);
		forceUpdate();
	};

	return (
		<HomeContainer>
			<div className={styles.Container}>
				{(()=>{
					if (value !== null) {
						return (
							<div className={styles.Container1}>
								<div className={styles.LargeContainer}>
									<div className={styles.InnerContainer}>
										<div className={styles.HeadContainer}>
											<div className={styles.LargeHead}>
												Transcript: "{name}"
											</div>
											<div className={styles.SaveView}>
												<button className={styles.Button} onClick={()=>{ onSave(); }}>
													Save
												</button>
												<Link to={`/view/${name}`}>
													<button className={styles.Button}>
														View
													</button>
												</Link>
											</div>
										</div>
									</div>
								</div>
								<div className={styles.LargeContainer}>
									<div className={styles.InnerContainer}>
										<div className={styles.SectionHead}>
											Student Information
										</div>
										<FieldInput name="Name" value={ value["Student Information"]["Name"] } onChange={(x)=>{
											value["Student Information"]["Name"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Date of Birth" value={ value["Student Information"]["Date of Birth"] } onChange={(x)=>{
											value["Student Information"]["Date of Birth"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Graduation Date" value={ value["Student Information"]["Graduation Date"] } onChange={(x)=>{
											value["Student Information"]["Graduation Date"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Gender" value={ value["Student Information"]["Gender"] } onChange={(x)=>{
											value["Student Information"]["Gender"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Address Line 1" value={ value["Student Information"]["Address Line 1"] } onChange={(x)=>{
											value["Student Information"]["Address Line 1"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Address Line 2" value={ value["Student Information"]["Address Line 2"] } onChange={(x)=>{
											value["Student Information"]["Address Line 2"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="City" value={ value["Student Information"]["City"] } onChange={(x)=>{
											value["Student Information"]["City"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="State" value={ value["Student Information"]["State"] } onChange={(x)=>{
											value["Student Information"]["State"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Zip Code" value={ value["Student Information"]["Zip Code"] } onChange={(x)=>{
											value["Student Information"]["Zip Code"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Phone" value={ value["Student Information"]["Phone"] } onChange={(x)=>{
											value["Student Information"]["Phone"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Email" value={ value["Student Information"]["Email"] } onChange={(x)=>{
											value["Student Information"]["Email"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Parent/Guardian(s)" value={ value["Student Information"]["Parent/Guardian(s)"] } onChange={(x)=>{
											value["Student Information"]["Parent/Guardian(s)"] = x;
											forceUpdate();
										}}/>
									</div>
								</div>
								<div className={styles.LargeContainer}>
									<div className={styles.InnerContainer}>
										<div className={styles.SectionHead}>
											School Information
										</div>
										<FieldInput name="School Name" value={ value["School Information"]["School Name"] } onChange={(x)=>{
											value["School Information"]["School Name"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Address Line 1" value={ value["School Information"]["Address Line 1"] } onChange={(x)=>{
											value["School Information"]["Address Line 1"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Address Line 2" value={ value["School Information"]["Address Line 2"] } onChange={(x)=>{
											value["School Information"]["Address Line 2"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="City" value={ value["School Information"]["City"] } onChange={(x)=>{
											value["School Information"]["City"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="State" value={ value["School Information"]["State"] } onChange={(x)=>{
											value["School Information"]["State"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Zip Code" value={ value["School Information"]["Zip Code"] } onChange={(x)=>{
											value["School Information"]["Zip Code"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="School Phone" value={ value["School Information"]["School Phone"] } onChange={(x)=>{
											value["School Information"]["School Phone"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="School Email" value={ value["School Information"]["School Email"] } onChange={(x)=>{
											value["School Information"]["School Email"] = x;
											forceUpdate();
										}}/>
										<FieldInput name="Administrator Name" value={ value["School Information"]["Administrator Name"] } onChange={(x)=>{
											value["School Information"]["Administrator Name"] = x;
											forceUpdate();
										}}/>
									</div>
								</div>
								<div className={styles.LargeContainer}>
									<div className={styles.SubjectContainer}>
										<div className={styles.SectionHead}>
											This transcript has {value["Student Coursework"].length} subject(s).
										</div>
										<button className={styles.Button} onClick={()=>{ onNewSubject(); }}>
											New Subject
										</button>
									</div>
								</div>
								{value["Student Coursework"].map((a, i) => {
									return (
										<div key={i} className={styles.SubjectContainer1}>
											<SubjectInput value={value} index={i} onUpdate={(x)=>{setValue(x); forceUpdate();}} onRemove={()=>{ onRemoveSubject(i); }}/>
										</div>
									);
								})}
								<div className={styles.LargeContainer}>
									<div className={styles.SubjectContainer}>
										<div className={styles.SectionHead}>
											Grading Scale
										</div>
										<div className={styles.CheckContainer}>
											(+/-)
											<input type="checkbox" checked={value["Grading Scale"]["Extended"]} onChange={(e)=>{
												value["Grading Scale"]["Extended"] = e.target.checked;
												forceUpdate();
											}}/>
										</div>
										<ScaleInput name="A+" value={value["Grading Scale"]["A+"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["A+"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="A" value={value["Grading Scale"]["A"]} onChange={(x)=>{
											value["Grading Scale"]["A"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="A-" value={value["Grading Scale"]["A-"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["A-"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="B+" value={value["Grading Scale"]["B+"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["B+"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="B" value={value["Grading Scale"]["B"]} onChange={(x)=>{
											value["Grading Scale"]["B"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="B-" value={value["Grading Scale"]["B-"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["B-"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="C+" value={value["Grading Scale"]["C+"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["C+"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="C" value={value["Grading Scale"]["C"]} onChange={(x)=>{
											value["Grading Scale"]["C"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="C-" value={value["Grading Scale"]["C-"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["C-"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="D+" value={value["Grading Scale"]["D+"]} disabled={!(value["Grading Scale"]["Extended"])} onChange={(x)=>{
											value["Grading Scale"]["D+"] = x;
											forceUpdate();
										}}/>
										<ScaleInput name="D" value={value["Grading Scale"]["D"]} onChange={(x)=>{
											value["Grading Scale"]["D"] = x;
											forceUpdate();
										}}/>
									</div>
								</div>
								<div className={styles.LargeContainer}>
									<div className={styles.SubjectContainer}>
										<div className={styles.SectionHead}>
											Notes
										</div>
										<div className={styles.NotesContainer}>
											<textarea rows="512" cols="1024" value={value["Notes"]} onChange={(e) => {
												value["Notes"] = e.target.value;
												forceUpdate();
											}}>
											</textarea>
										</div>
									</div>
								</div>
							</div>
						);
					}
					else {
						return (
							<Loader/>
						);
					}
				})()}
			</div>
		</HomeContainer>
	);

}
import React, { Component, useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './View.css';
import Logo from './Logo.jpg';

function ViewHeadEntry(props) {
	if (props.value.length == 0) {
		return (null);
	}
	else {
		return (
			<div className="view-head-entry-div">
				<span className="view-head-entry-span-1">
					{props.name}:
				</span>
				&nbsp;
				<span className="view-head-entry-span-2">
					{props.value}
				</span>
			</div>
		);
	}
}

function ViewHeadGroup(props) {
	if (props.value.length == 0) {
		return (null);
	}
	else {
		return (
			<div className="view-head-group-div">
				<div className="view-head-group-div-1">
					{props.name}
				</div>
				<div className="view-head-group-div-2">
					{props.value.map((x, i)=>{
						return (
							<ViewHeadEntry key={i} name={x.name} value={x.value}/>
						);
					})}
				</div>
			</div>
		);
	}
}

function ViewCourseEntry(props) {
	if (props.value.name.length == 0) {
		return (null);
	}
	else {
		return (
			<tr className="view-course-entry-tr">
				<td>
					{props.value.name}
				</td>
				<td>
					{props.value.provider}
				</td>
				<td>
					{props.value.year}
				</td>
				<td>
					{props.value.type}
				</td>
				<td>
					{props.value.grade}
				</td>
				<td>
					{props.value.credit}
				</td>
			</tr>
		);
	}
}

/*
subject
{
	name
	value [
		course
	]
}
*/

function ViewSubjectEntry(props) {
	let credit = 0;
	for (let x of props.value.value) {
		let z = checkGrade(x.grade, props.gradeInfo, x.type);
		if (z.countTotal) {
			let y = parseInt(x.credit);
			if (!isNaN(y)) {
				credit += y;
			}
		}
	}
	if (props.value.name.length == 0) {
		return (null);
	}
	else {
		return (
			<tbody>
				<tr className="view-subject-entry-tr">
					<th>
						{props.value.name}
					</th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th  className="view-subject-entry-th">
						{credit}
					</th>
				</tr>
				{props.value.value.map((x, i)=> {
					return (
						<ViewCourseEntry key={i} value={x}/>
					);
				})}
			</tbody>
		);
	}
}

function ViewSubjectGroup(props) {
	return (
		<table className="view-subject-group-table">
			<thead>
				<tr className="view-subject-group-tr">
					<th>
						Subjects/Courses
					</th>
					<th>
						Course Provider
					</th>
					<th>
						School Year
					</th>
					<th>
						Type
					</th>
					<th>
						Grade
					</th>
					<th>
						Credit
					</th>
				</tr>
			</thead>
			{props.value.map((x, i)=>{
				return (
					<ViewSubjectEntry key={i} value={x} gradeInfo={props.gradeInfo}/>
				);
			})}
		</table>
	);
}

function ViewGradeScaleEntry(props) {
	return (
		<div className="view-grade-scale-entry-div">
			<span className="view-grade-scale-entry-span-1">
				{props.value.name}
			</span>
			&nbsp;=&nbsp;
			{props.value.value}
		</div>
	);
}

function ViewGradeScale(props) {
	if (!props.value.extended) {
		return (
			<div className="view-grade-scale-div">
				<div className="view-grade-scale-div-1">
					Grading Scale
				</div>
				<div className="view-grade-scale-div-2">
					<ViewGradeScaleEntry value={props.value["A"]}/>
					<ViewGradeScaleEntry value={props.value["B"]}/>
					<ViewGradeScaleEntry value={props.value["C"]}/>
					<ViewGradeScaleEntry value={props.value["D"]}/>
					<ViewGradeScaleEntry value={{
						name: "F",
						value: "Fail"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "P",
						value: "Pass"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "NP",
						value: "No Pass"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "IP",
						value: "In Progress"
					}}/>
				</div>
			</div>
		);
	}
	else {
		return (
			<div className="view-grade-scale-div">
				<div className="view-grade-scale-div-1">
					Grading Scale
				</div>
				<div className="view-grade-scale-div-2">
					<ViewGradeScaleEntry value={props.value["A+"]}/>
					<ViewGradeScaleEntry value={props.value["A"]}/>
					<ViewGradeScaleEntry value={props.value["A-"]}/>
					<ViewGradeScaleEntry value={props.value["B+"]}/>
					<ViewGradeScaleEntry value={props.value["B"]}/>
					<ViewGradeScaleEntry value={props.value["B-"]}/>
					<ViewGradeScaleEntry value={props.value["C+"]}/>
					<ViewGradeScaleEntry value={props.value["C"]}/>
					<ViewGradeScaleEntry value={props.value["C-"]}/>
					<ViewGradeScaleEntry value={props.value["D+"]}/>
					<ViewGradeScaleEntry value={props.value["D"]}/>
					<ViewGradeScaleEntry value={{
						name: "F",
						value: "Fail"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "P",
						value: "Pass"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "NP",
						value: "No Pass"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "IP",
						value: "In Progress"
					}}/>
					<ViewGradeScaleEntry value={{
						name: "PL",
						value: "Planned"
					}}/>
				</div>
			</div>
		);
	}
}

function ViewTypeKeyEntry(props) {
	return (
		<div className="view-type-key-entry-div">
			<span className="view-type-key-entry-span-1">
				{props.value.name}
			</span>
			&nbsp;=&nbsp;
			{props.value.value}
		</div>
	);
}

function ViewTypeKey(props) {
	return null;
	return (
		<div className="view-type-key-div">
			<div className="view-type-key-div-1">
				Type Key
			</div>
			<div className="view-type-key-div-2">
				<ViewTypeKeyEntry value={{
					name: "HR",
					value: "Honors course. (Weighted +0.50)"
				}}/>
				<ViewTypeKeyEntry value={{
					name: "AP",
					value: "College Board approved AP course. (Weighted +1.00)"
				}}/>
				<ViewTypeKeyEntry value={{
					name: "MS",
					value: "High school level course taken in middle school."
				}}/>
				<ViewTypeKeyEntry value={{
					name: "DE",
					value: "Dual-enrolled college course. (Weighted +1.00)"
				}}/>
			</div>
		</div>
	);
}

function checkWeight(type) {
	switch (type) {
		case "HR":
			return 0.50;
		case "AP":
			return 1.00;
		case "MS":
			return 0.00;
		case "DE":
			return 1.00;
		default:
			return 0.00;
	}
}

function checkGrade(grade, gradeInfo, weight) {
	if (Object.hasOwnProperty.bind(gradeInfo)(grade)) {
		return {
			countGPA: true,
			countTotal: true,
			value: parseFloat(gradeInfo[grade].value),
			valueWeighted: parseFloat(gradeInfo[grade].value) + checkWeight(weight)
		};
	}
	else if (grade == "F") {
		return {
			countGPA: true,
			countTotal: false,
			value: 0,
			valueWeighted: 0
		}
	}
	else if (grade == "P") {
		return {
			countGPA: false,
			countTotal: true
		}
	}
	else if (grade == "NP") {
		return {
			countGPA: false,
			countTotal: false
		}
	}
	else if (grade == "IP") {
		return {
			countGPA: false,
			countTotal: false
		}
	}
	else if (grade == "PL") {
		return {
			countGPA: false,
			countTotal: false
		}
	}
	else {
		alert("INVALID GRADE INPUT");
	}
}

function calculateGPA(state) {
	let attempted = 0;
	let awarded = 0;
	let quality = 0;
	let qualityWeighted = 0;
	for (let x of state.subjectInfo) {
		for (let y of x.value) {
			let grade = y.grade;
			let credit = parseInt(y.credit);
			let z = checkGrade(grade, state.gradeInfo, y.type);
			if (z.countGPA) {
				attempted += credit;
				quality += (credit * z.value);
				qualityWeighted += (credit * z.valueWeighted);
			}
			if (z.countTotal) {
				awarded += credit;
			}
		}
	}
	let gpa = quality / attempted;
	let gpaWeighted = qualityWeighted / attempted;
	return {
		gpa: gpa,
		gpaWeighted: gpaWeighted,
		awarded: awarded
	};
}

function ViewGraduationRequirements(props) {
	let info = calculateGPA(props.value);
	return (
		<table className="view-requirements-table">
			<thead>
				<tr className="view-requirements-tr-1">
					<th colSpan={2}>
						Type Key
					</th>
					<th className="view-requirements-th-2">
						Credits Required
					</th>
					<th className="view-requirements-th-2">
						{130}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<span className="view-requirements-span-1">
							HR
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							= Honors course. (Weighted +0.50)
						</span>
					</td>
						<span className="view-requirements-span-1">
							AP
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							= College Board AP. (Weighted +1.00)
						</span>
					<td>
						<span className="view-requirements-span-1">
							Credits Awarded
						</span>
					</td>
					<td>
						<span className="view-requirements-span-1">
							{info.awarded}
						</span>
					</td>
				</tr>
				<tr>
					<td>
						<span className="view-requirements-span-1">
							MS
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							= High school course taken in Middle School.
						</span>
					</td>
						<span className="view-requirements-span-1">
							DE
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							= Dual-enrolled college course. (Weighted +1.00)
						</span>
					<td>
						<span className="view-requirements-span-1">
							Unweighted GPA
						</span>
					</td>
					<td>
						<span className="view-requirements-span-1">
							{info.gpa.toFixed(2)}
						</span>
					</td>
				</tr>
				<tr>
					<td>
						<span className="view-requirements-span-1">
							
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							
						</span>
					</td>
						<span className="view-requirements-span-1">
							
						</span>
						&nbsp;
						<span className="view-requirements-span-2">
							
						</span>
					<td>
						<span className="view-requirements-span-1">
							Weighted GPA
						</span>
					</td>
					<td>
						<span className="view-requirements-span-1">
							{info.gpaWeighted.toFixed(2)}
						</span>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function ViewExtra(props) {
	if (props.value.value.length == 0) {
		return (null);
	}
	else {
		return (
			<div className="view-extra-div">
				<div className="view-extra-div-1">
					Notes
				</div>
				<div className="view-extra-div-2">
					<pre className="view-extra-pre">
						{props.value.value}
					</pre>
				</div>
			</div>
		);
	}
}

function currentDate() {
	let x = new Date();
	return x.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

function ViewSignature(props) {
	return (
		<div className="view-signature-div">
			<div className="view-signature-div-1">
				Signature
			</div>
			<div className="view-signature-div-2">
				I hereby certify and affirm that this is the official high school transcript and record of {props.value.studentInfo.name},<br/>
				who has met or exceeded the requirements for high school graduation in accordance with<br/>
				California Education Code section 48222 pertaining to private schools.
			</div>
			<div className="view-signature-div-3">
				<div>
					{props.value.schoolInfo.admin}<br/>
					Administrator
				</div>
				<div>
					{currentDate()}<br/>
					Date
				</div>
			</div>
		</div>
	);
}

export default function View(props) {
	const { name } = useParams();
	const [ state, setState ] = useState({});
	const [ loaded, setLoaded ] = useState(false);
	function convertStudentInfo() {
		return [
			{ name: "Name", value: state["Student Information"]["Name"] },
			{ name: "Date of Birth", value: state["Student Information"]["Date of Birth"] },
			{ name: "Graduation Date", value: state["Student Information"]["Graduation Date"] },
			{ name: "Gender", value: state["Student Information"]["Gender"] },
			{ name: "Address Line 1", value: state["Student Information"]["Address Line 1"] },
			{ name: "Address Line 2", value: state["Student Information"]["Address Line 2"] },
			{ name: "City", value: state["Student Information"]["City"] },
			{ name: "State", value: state["Student Information"]["State"] },
			{ name: "Zip Code", value: state["Student Information"]["Zip Code"] },
			{ name: "Phone", value: state["Student Information"]["Phone"] },
			{ name: "Email", value: state["Student Information"]["Email"] },
			{ name: "Parent/Guardian(s)", value: state["Student Information"]["Parent/Guardian(s)"] }
		];
	}
	function convertSchoolInfo() {
		return [
			{ name: "Name", value: state["School Information"]["School Name"] },
			{ name: "Address Line 1", value: state["School Information"]["Address Line 1"] },
			{ name: "Address Line 2", value: state["School Information"]["Address Line 2"] },
			{ name: "City", value: state["School Information"]["City"] },
			{ name: "State", value: state["School Information"]["State"] },
			{ name: "Zip Code", value: state["School Information"]["Zip Code"] },
			{ name: "Phone", value: state["School Information"]["School Phone"] },
			{ name: "Email", value: state["School Information"]["School Email"] },
			{ name: "Administrator", value: state["School Information"]["Administrator Name"] }
		];
	}
	function convertGradeInfo() {
		let res = {
			extended: state["Grading Scale"]["Extended"],
			A: { name: "A", value: state["Grading Scale"]["A"] },
			B: { name: "B", value: state["Grading Scale"]["B"] },
			C: { name: "C", value: state["Grading Scale"]["C"] },
			D: { name: "D", value: state["Grading Scale"]["D"] }
		};
		//if (state["Grading Scale"]["Extended"]) {
		res["A+"] = { name: "A+", value: state["Grading Scale"]["A+"] };
		res["A-"] = { name: "A-", value: state["Grading Scale"]["A-"] };
		res["B+"] = { name: "B+", value: state["Grading Scale"]["B+"] };
		res["B-"] = { name: "B-", value: state["Grading Scale"]["B-"] };
		res["C+"] = { name: "C+", value: state["Grading Scale"]["C+"] };
		res["C-"] = { name: "C-", value: state["Grading Scale"]["C-"] };
		res["D+"] = { name: "D+", value: state["Grading Scale"]["D+"] };
		//}
		return res;
	}
	function convertExtraInfo() {
		return {
			value: state["Notes"]
		};
	}
	function convertCourse(x) {
		/*
			"Course Name": "",
			"Provider": "",
			"Year": "",
			"Type": "",
			"Grade": "",
			"Credit": ""
		*/
		return {
			name: x["Course Name"],
			provider: x["Provider"],
			year: x["Year"],
			type: x["Type"],
			grade: x["Grade"],
			credit: x["Credit"]
		};
	}
	function convertSubject(x) {
		let res = {
			name: x["Subject Name"],
			value: []
		};
		for (let y of x["Course List"]) {
			res.value.push(convertCourse(y));
		}
		return res;
	}
	function convertSubjectInfo() {
		let res = [];
		for (let x of state["Student Coursework"]) {
			res.push(convertSubject(x));
		}
		return res;
	}
	function convertState() {
		return {
			studentInfo: convertStudentInfo(),
			schoolInfo: convertSchoolInfo(),
			subjectInfo: convertSubjectInfo(),
			gradeInfo: convertGradeInfo(),
			extraInfo: convertExtraInfo()
		};
	}
	if (loaded) {
		console.log(convertState());
	}
	useEffect(() => {
		const requestValue = async () => {
			const res = await axios.post(`https://api.rivendelltranscript.com/save/read/`,
				{ name: name },
				{ withCredentials: true }
			);
			setState(res.data);
			setLoaded(true);
		};
		requestValue();
	}, []);
	if (!loaded) {
		return (
			<div>
				LOADING...
			</div>
		);
	}
	else {
		return (
			<div className="view-div">
				<Link className="edit-link" to={`/edit/${name}`}>EDIT</Link>
				<div className="view-head-1">
					<div className="view-head-1-side">
					</div>
					<div className="view-head-1-main">
						<div className="view-head-1-main-1">
							{ convertState().schoolInfo.name }
						</div>
						<div className="view-head-1-main-2">
							Official High School Transcript
						</div>
					</div>
					<div className="view-head-1-side">
						<img className="view-head-1-side-img" src={Logo}/>
					</div>
				</div>
				<div className="view-div-1">
					<div className="view-div-2">
						<div className="view-div-3">
							<ViewHeadGroup name="Student Information" value={convertStudentInfo()}/>
						</div>
						<div className="view-div-3">
							<ViewHeadGroup name="School Information" value={convertSchoolInfo()}/>
						</div>
					</div>
				</div>
				<div className="view-div-1">
					<ViewSubjectGroup value={convertSubjectInfo()} gradeInfo={convertGradeInfo()}/>
				</div>
				<div className="view-div-1">
					<ViewGraduationRequirements value={convertState()}/>
				</div>
				<div className="view-div-1">
					<ViewGradeScale value={convertGradeInfo()}/>
				</div>
				<div className="view-div-1">
					<ViewTypeKey/>
				</div>
				<div className="view-div-1">
					<ViewExtra value={convertExtraInfo()}/>
				</div>
				<div className="view-div-1">
					<ViewSignature value={{
						studentInfo: {
							name: state["Student Information"]["Name"]
						},
						schoolInfo: {
							admin: state["School Information"]["Administrator Name"]
						}
					}}/>
				</div>
			</div>
		);
	}
}
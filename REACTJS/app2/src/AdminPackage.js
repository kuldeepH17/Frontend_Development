import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import getBase from "./Api";
import { showError, showMessage, NetworkError } from "./ToastMessage";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
export default function AdminPackage() {

    let { doctorid } = useParams();
    console.log("doctor id = ", doctorid);

    let [packages, setPackage] = useState([]);
    let [doctorName, setDoctorName] = useState('');

    let displayPackage = (item) => {
        return (<tr>
            <td>{item.id}</td>
            <td><b>{item.title}</b><br />
                {item.detail}</td>
            <td>
                <img src="https://picsum.photos/70" className="img-fluid" />
            </td>
            <td>{item.charges}</td>
            <td>{item.duration}</td>
            <td>
                <a href="doctor-edit-pakage.html" title="Edit"><i className="fa-solid fa-pen-to-square fa-lg ms-1" /></a>
                <a href="#" title="delete"><i className="fa-solid fa-trash fa-lg ms-3" style={{ "color": "#ff0000" }} /></a>
            </td>
        </tr>);
    }
    let noPackageFound = function () {
        return (<tr>
            <td colSpan='6' className="text-danger fs-3 text-center">No Package Found</td>
        </tr>)
    }

    useEffect(() => {
        if (packages.length === 0) {

            let apiAddress = getBase() + "package.php?doctorid=" + doctorid;
            fetch(apiAddress)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let error = data[0]['error'];
                    console.log(error);
                    if (error !== 'no') {
                        showError(error);
                    }
                    else if (data[1]['total'] === 0) {
                        showError('no package found');
                    }
                    else {
                        data.splice(0, 2);
                        setPackage(data);
                        setDoctorName(data[0]['name']);
                        showMessage('Data loaded successfully');
                    }
                })
                .catch((error) => {
                    NetworkError(error);
                });
        }
    });

    return (<>
        <Menu />
        <main id="main" className="main">
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="mb-3 fw-bolder">
                            <h1>Doctor management</h1>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header text-bg-primary h4 d-flex justify-content-between">Package - {doctorName}
                                <a href="doctor-add-package.html" className="btn btn-light">Add packages <i className="fa-solid fa-floppy-disk ms-1" /></a>
                            </div>
                            <div className="card-body mt-3">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Sr no</th>
                                                <th>Title details</th>
                                                <th>Photo</th>
                                                <th>Charge</th>
                                                <th>Duration</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(packages.length > 0) ? packages.map((item) => displayPackage(item)) : noPackageFound()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
    );
}

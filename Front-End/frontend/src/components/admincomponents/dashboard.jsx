import Navbar from "../navigation";
import CrudTable from "./institutions";
import React from "react";
// import Navbar from "../navigation";

const InstitutionsTable = () => {
    const titles = 'Institutions';
    const colNames = ['name', 'email', 'phone','is_institution_approved'];
    // const cols = [{'name'}, {'email'}, {'phone'},{'is_institution_approved'}];
    const colTitles = ['Name', 'Email', 'Phone','Approved'];
    // const colNames = ['name', 'email', 'phone'];
    const endpoint = 'viewsets/institutions';

    return(
        <>
            <Navbar title="Home"/>
            <CrudTable titles={titles} colNames={colNames} colTitles={colTitles} endpoint={endpoint} />;
        </>

    ) 
};

export default InstitutionsTable;
import Navbar from "../navigation";
import React from "react";
import { AdvancedOptions, Graphs, InstitutionCrud, UserCrud, VisitsPerActionChart, VisitsPerDaypartChart, VisitsPerInstitutionChart, VisitsPerTableChart } from "./dashboardcomponents";
// import Navbar from "../navigation";

const Dash = () => {
    const [section, setSection] = React.useState('Graphs');
    
    const handleSectionClick = (next_section) => {
        setSection(next_section);
    };

    return(
        <><Navbar title="Home"/>
            <br /><br /><br />
            <h1 className="text-title-md2 font-semibold text-primary dark:text-white centerholder">Dashboard</h1>
            <br /><hr />
            <div className="centerholder">
                <button className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" onClick={() => handleSectionClick('Graphs')}>Graphs</button>
                <button className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" onClick={() => handleSectionClick('Institutions')}>Institutions</button>
                <button className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" onClick={() => handleSectionClick('Users')}>Users</button>
                <button className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" onClick={() => handleSectionClick('Advanced')}>Advanced</button>
            </div>
            {section === 'Institutions' && <InstitutionCrud />}
            {section === 'Users' && <UserCrud />}
            {section === 'Graphs' && <Graphs/>}
            {section === 'Advanced' && <AdvancedOptions/>}
            
            
        </>
    );

};

export default Dash;
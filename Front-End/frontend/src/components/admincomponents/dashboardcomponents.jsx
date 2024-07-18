import React, { useEffect, useState } from 'react';
import { Pie,Bar,Doughnut } from 'react-chartjs-2';
import { fetchVisitData } from '../reusable/functions';
import CrudTable from "./crudtable";
import { Chart , ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(ArcElement, BarElement);
Chart.register(Legend);
Chart.register(Tooltip);
Chart.register(CategoryScale, LinearScale);

export const VisitsPerInstitutionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchVisitData('per_institution');
      if (data) {
        setChartData({
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
          }]
        });
      }
    };
    fetchData();
  }, []);

  if (!chartData) return <div>No Data</div>;

  return (
    <div>
      <h2 className='centerholder'>Most Active Institutions</h2>
      <Pie data={chartData} />
    </div>
  );
};

export const VisitsPerTableChart = () => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchVisitData('per_table');
        if (data) {
          setChartData({
            labels: Object.keys(data),
            datasets: [{
              label: 'Visits',
              data: Object.values(data),
              backgroundColor: '#36A2EB',
            }]
          });
        }
      };
      fetchData();
    }, []);
    const options = {
      scales: {
          y: {
              beginAtZero: false,
              title: {
                  display: true,
                  text: 'Visits'
              }
          },
          x: {
              title: {
                  display: true,
                  text: 'Table'
              }
          }
      },
      responsive: true,
      plugins: {
          legend: {
              position: 'top',
          },
          title: {
              display: true,
              text: 'Table Visits',
          },
      },
    };
    if (!chartData) return <div>No Data Yet</div>;
  
    return (
      <div>
        <h2 className='centerholder'>Visits Per Table</h2>
        <Bar data={chartData} options={options}/>
      </div>
    );
};

export const VisitsPerActionChart = () => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchVisitData('per_action');
        if (data) {
          setChartData({
            labels: Object.keys(data),
            datasets: [{
              data: Object.values(data),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
          });
        }
      };
      fetchData();
    }, []);
  
    if (!chartData) return <div>No data</div>;
  
    return (
      <div>
        < h2 className='centerholder'>Visits Per Action</h2>
        <Doughnut data={chartData} />
      </div>
    );
};

export const VisitsPerDaypartChart = () => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchVisitData('per_daypart');
        if (data) {
          setChartData({
            labels: Object.keys(data),
            datasets: [{
              data: Object.values(data),
              backgroundColor: [
                '#FF6384', // morning
                '#36A2EB', // afternoon
                '#FFCE56', // evening
                '#4BC0C0', // night
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
              ]
            }]
          });
        }
      };
      fetchData();
    }, []);
  
    if (!chartData) return <div>No data</div>;
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Visits Per Daypart',
        },
      },
    };
  
    return (
      <div>
        <h2 className='centerholder'>Visits Per Daypart</h2>
        <Pie data={chartData} options={options} />
      </div>
    );
};

export const Graphs= () => {
  return (
    <> 
        <br />
        <h6 className="text-title-md1 font-semibold text-primary dark:text-white centerholder">At A Glance</h6><hr />
        <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'><VisitsPerTableChart></VisitsPerTableChart></div>
        <br />
        <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'><VisitsPerActionChart></VisitsPerActionChart></div>
        <br />
        <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'><VisitsPerInstitutionChart/></div>
        <br />
        <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'><VisitsPerDaypartChart/></div>
        <br />
        
        
        
    </>
  );
}

export const UserCrud= () => {
    const titles = "User Management";
    // const colNames = ["email", "fname", "lname", "role", "institution", "is_active"];
    const colNames = ["email", "fname", "lname","is_active"];
    const colTitles = ["Email", "First Name", "Last Name", "Active"];
    const endpoint = "viewsets/usermanagement";

    return (
        <>            
            <CrudTable 
                titles={titles} 
                colNames={colNames} 
                colTitles={colTitles} 
                endpoint={endpoint} 
            />
        </>
    );
}

export const InstitutionCrud= () => {
    const titles = 'Institutions';
    const colNames = ['name', 'email', 'phone','is_institution_approved'];
    // const cols = [{'name'}, {'email'}, {'phone'},{'is_institution_approved'}];
    const colTitles = ['Name', 'Email', 'Phone','Approved'];
    // const colNames = ['name', 'email', 'phone'];
    const endpoint = 'viewsets/institutions';
    return(
        <>
            <CrudTable titles={titles} colNames={colNames} colTitles={colTitles} endpoint={endpoint} />;
        </>

    ) 
}
export const AdvancedOptions= () => {
  return (
    <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
    <h2 className="text-title-md3 font-semibold text-primary">Advanced Options</h2>
    <br />
    <b>
      <h4 className='italic bold'>For security purposes you may be required to login again.</h4>
    </b>
    <br />
    <a className="underline text-primary centerholder" href="http://127.0.0.1:8000/admin" target='_blank'>
      Click To Proceed To Advanced Options...
    </a>
    </div>
  );
}
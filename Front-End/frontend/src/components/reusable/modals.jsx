import { useEffect, useState } from "react";
import { generalDelete, generalPatch, makeNotification, searchFunction } from "./functions";

export const DeleteConfirmationModal = ({ show, onClose, onConfirm, name }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete the "{name}"?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="btn btn-secondary mr-2">Cancel</button>
                    <button onClick={onConfirm} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    );
};
export const DeleteModal = ({show,name,endpoint,id,onClose,itemKind }) => {
    
    const [status,setStatus] = useState('')
    const onConfirm = async(id)=>{
        try {
            setStatus("Deleting...");
            await generalDelete( endpoint, id);
            await makeNotification(`${itemKind} ${name} has been removed by Scheduler`);
            onClose();
        } catch (error) {
            console.log(error)
        }
        setStatus('');

    }

    if (!show) return null;

    return (
        <dialog onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete "{name}"?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="btn btn-secondary mr-2">Cancel</button>
                    <button onClick={()=>{onConfirm(id)}} className="btn btn-danger">Delete</button>
                </div>
                {status}
            </div>
        </dialog>
    );
};
export const EditLessonModal = ({show,lesson,onClose}) => {
    
    const [availableTimings,setAvailableTimings] = useState([]);
    const [status,setStatus] = useState('')

    useEffect(()=>{
        fetchAvailableTimings();
    },[lesson])

    const fetchAvailableTimings = async()=>{
        try {
            console.log("yo");
            console.log(lesson);
            setStatus("Fetching available timings...");
            const response = await searchFunction('viewsets/meetingtimes/availabletimings',{lessonId:lesson.id});
            console.log(response)
            setAvailableTimings(response.available_times);
        } catch (error) {
            console.log(error)
        }
        setStatus('')
    }
    const onAvailableTimingClick = async(mtId)=>{
        try {
            setStatus('Updating...')
            await generalPatch('viewsets/lessonupdate/',lesson.id,{meeting_time:mtId});
        } catch (error) {
            console.log(error)
        }
        setStatus('')
        onClose()
    }
    

    if (!show) return null;

    return (
        <dialog onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]">
            <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">Available Times</h2>
                <select
                    id="availableTimings"
                    required
                    onChange={(e) => onAvailableTimingClick(e.target.value)}
                >
                    <option value="">Pick a time</option>
                    {availableTimings.map(availableTiming => (
                        <option key={availableTiming.id} value={availableTiming.id}>
                            {`${availableTiming.day} - ${availableTiming.time}`}
                        </option>
                    ))}
                </select>
                {status}
            </div>
        </dialog>
    );
};


// make modal work, should take input eg tablename column name then make a general delete request on click use dialog tag
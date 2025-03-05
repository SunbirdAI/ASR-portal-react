import React, { useEffect, useState } from "react";
import { getTranscripts } from "../../API";
import DataTable from "../DataTable/DataTable";

const Files = () => {

    const [transcriptData, setTranscriptData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTranscripts();
                setTranscriptData(response);
                console.log(transcriptData)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (

        <div className="col-span-12 space-y-4 ">
            <div className="p-5 items-stretch ">
                <div className="py-3 rounded-lg shadow-xl border" >
                    <p className="text-center font-medium antialiased  text-2xl">Recent Files</p>
                    <div className=" flex items-center justify-center">
                        {loading ? <i class="fa fa-spinner animate-spin py-5" aria-hidden="true"></i> :
                            <DataTable transcriptData={transcriptData} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Files
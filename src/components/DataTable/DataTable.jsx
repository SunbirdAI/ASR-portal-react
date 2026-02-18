import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const DataTable = ({ transcriptData }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [paginatedData, setPaginatedData] = useState([]);
    const [isFirstPage, setIsFirstPage] = useState(true)
    const [isLastPage, setIsLastPage] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');

    // Handle the search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter the data based on the search query
    const filteredData = transcriptData.filter(({ filename }) =>
        filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    const transformedData = filteredData.map(({ id, username, email, filename, uploaded, audio_file_url, transcription }) => ({
        id: id,
        username,
        filename,
        uploaded: new Date(uploaded).toLocaleString('en-US', options),
        audio_file_url: audio_file_url,
        email,
        transcription,
    }));

    useEffect(() => {
        const paginate = () => {
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const viewedData = transformedData.slice(indexOfFirstItem, indexOfLastItem)
            setPaginatedData(viewedData);
            indexOfFirstItem === 0 ? setIsFirstPage(true) : setIsFirstPage(false)
            indexOfLastItem >= transformedData.length ? setIsLastPage(true) : setIsLastPage(false)
        };
        paginate();
    }, [currentPage, itemsPerPage, searchQuery]);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (isLastPage) { }
        else { setCurrentPage((prevPage) => prevPage + 1); }
    };

    const handlePrevPage = () => {
        if (isFirstPage) { }
        else { setCurrentPage((prevPage) => prevPage - 1); }
    };

    const toggleDropdown = (id) => {
        document.getElementById(`dropdown-${id}`).classList.toggle('hidden');
    };

    return (<>
        <div className="bg-white border border-[#E5E5E3] p-8 rounded-2xl w-full">
            <div className=" flex items-center justify-between pb-6 flex-wrap">
                <div className=" flex items-baseline">
                    <p>Show   </p>
                    <div className="px-3 py-3">
                        <select className="px-2 border-2 border-black/30 rounded-lg focus:outline-sunbird-orange" onChange={handleItemsPerPageChange} value={itemsPerPage}>
                            <option value={5}>
                                5
                            </option>
                            <option value={10}>
                                10
                            </option>
                            <option value={20}>
                                20
                            </option>
                            <option value={transformedData.length}>
                                all
                            </option>
                        </select></div>

                    <p>  entries</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-white border border-[#E5E5E3] items-center p-2 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black/50" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            />
                        </svg>
                        <input className="bg-white outline-none ml-1 block placeholder:text-black/50" onChange={handleSearchChange} type="text" name="" id="" placeholder="search..." />
                    </div>
                </div>
            </div>
            <div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th
                                        className="px-5 py-3 border-b-2 border-[#E5E5E3] bg-[#EFEFED] text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        File Name
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-[#E5E5E3] bg-[#EFEFED] text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        Uploaded
                                    </th>

                                    <th
                                        className="px-5 py-3 border-b-2 border-[#E5E5E3] bg-[#EFEFED] text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        Actions
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map(({ id, username, email, filename, uploaded, audio_file_url, transcription }, i) => <tr key={i} className="hover:bg-[#F7F7F6] transition-opacity bg-white">
                                    <td className="px-5 py-5 border-b border-[#E5E5E3] text-sm">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10">
                                                <img className="w-full h-full rounded-full"
                                                    src="https://www.svgrepo.com/show/495027/audio-square.svg"
                                                    alt="" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-black whitespace-no-wrap">
                                                    {filename}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-[#E5E5E3] text-sm">
                                        <p className="text-black whitespace-no-wrap">{uploaded}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-[#E5E5E3] text-sm relative">
                                        <span
                                            className="relative inline-block px-3 py-1 font-semibold text-black hover:bg-white bg-[#EFEFED] rounded-full leading-tight border border-[#E5E5E3]">
                                            <span aria-hidden
                                                className="absolute inset-0 bg-white opacity-40 rounded-full"></span>
                                            <span onClick={() => toggleDropdown(i)} className="relative inline-block cursor-pointer">•••</span>
                                        </span>
                                        <div
                                            id={`dropdown-${i}`}
                                            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-md bg-white border border-[#E5E5E3] z-10"
                                        >
                                            <div className="py-1">

                                                <NavLink className="block px-4 py-2 text-sm text-black hover:bg-[#EFEFED]" to={`/files/edit/${id}`}>
                                                    <i className="fas fa-eye mr-2"></i>  View Transcription
                                                </NavLink>
                                            </div>
                                        </div>
                                    </td>
                                </tr>)

                                }
                            </tbody>
                        </table>
                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                            <span className="text-xs xs:text-sm text-black">
                                Showing {(currentPage * itemsPerPage) - itemsPerPage + 1} to {(currentPage * itemsPerPage) <= transformedData.length ? (currentPage * itemsPerPage) : transformedData.length} of {transformedData.length} Entries
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={handlePrevPage}
                                    className="text-sm text-black transition duration-150 hover:bg-white bg-[#EFEFED] border border-[#E5E5E3] font-semibold py-2 px-4 rounded-full">
                                    Prev
                                </button>
                                &nbsp; &nbsp;
                                <button
                                    onClick={handleNextPage}
                                    className="text-sm text-black transition duration-150 hover:bg-white bg-[#EFEFED] border border-[#E5E5E3] font-semibold py-2 px-4 rounded-full">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default DataTable

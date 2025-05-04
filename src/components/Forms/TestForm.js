"use client";
import {useState, useEffect} from 'react';
import DatePicker from '../FormElements/DatePicker/DatePicker';
import { useForm } from 'react-hook-form';
import {getClients, saveTestInfo } from '@/actions/server';
import useColorMode from '@/hooks/useColorMode';
import { UploadButton } from '@/lib/utils/uploadthing';
import toast from 'react-hot-toast';

function TestForm() {
    const [colorMode] = useColorMode(); // Removed unused setter
    const {register:register3, handleSubmit:handleSubmit3, formState:{errors:errors3}, setValue} = useForm();
    const [testFormOpen, setTestFormOpen] = useState(false); 
    const [inputRows, setInputRows] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [clients, setClients] = useState([]);
    const [clientsLoading, setClientsLoading] = useState(false);
    const [dateErrors, setDateErrors] = useState({}); // Track date errors by ID
    const [fTFile, setFTFile] = useState(null);
    const [fTDate, setFTDate] = useState(null);
    const [testData, setTestData] = useState({
        testNames: {},
        testResults: {},
        testFiles: {},
        testDates: {}
    });
    
    // Load clients only once when component mounts
    useEffect(() => {
        const fetchClients = async () => {
            setClientsLoading(true);
            try {
                const clients = await getClients();
                setClients(clients);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
                toast.error("Failed to load clients");
            } finally {
                setClientsLoading(false);
            }
        }
        fetchClients();
    }, []); // No dependency on colorMode

    const addRow = () => {
        const id = nextId;
        const newRow = {
            id,
            component: (
                <div className="mb-6 flex flex-col gap-6 xl:grid xl:grid-cols-2 items-center justify-center" key={id}>
                    <div className="mb-4.5 w-full ">
                        <DatePicker 
                            inputName={`testDate${id}`} 
                            nextId={id} 
                            labelName={`Test Date`}
                            getTestDateFn={(date) => getTestDateFn(date, id)} 
                        />
                        {dateErrors[id] && <div className="text-rose-500">Test date is required</div>}
                    </div>
                    <div className="w-full ">
                        <label name={`testName${id}`} className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Test Name
                        </label>
                        <input 
                            placeholder="Enter Test Name" 
                            onChange={(e) => updateTestData('testNames', id, e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                            type="text"
                        />
                    </div>
                    <div className="w-full">
                        <label name={`testResult${id}`} className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Test Result
                        </label>
                        <input 
                            placeholder="Enter Test Result" 
                            onChange={(e) => updateTestData('testResults', id, e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                            type="text"
                        />
                    </div>
                    <div className="w-full relative">
                        <label name={`testFile${id}`} className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Upload Test Result
                        </label>
                        <UploadButton  
                            className="block ut-allowed-content:float-right w-full border-[1.5px] border-stroke bg-transparent rounded p-1.5 text-sm text-slate-500 ut-button:mr-4 ut-button:py-2 ut-button:px-4 ut-button:rounded-full ut-button:border-0 ut-button:text-sm ut-button:font-semibold ut-button:bg-violet-50 ut-button:text-violet-700 hover:ut-button:bg-violet-100" 
                            endpoint="imageUploader" 
                            onClientUploadComplete={(res) => {
                                updateTestData('testFiles', id, res[0].url);
                                toast.success("Upload Completed");
                            }}
                            onUploadError={(error) => {
                                toast.error(`Upload Error: ${error.message}`);
                            }}
                        />
                        <span className={`absolute top-0 right-0 ${testData.testFiles[id] ? "block" : "hidden"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#008000" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </span> 
                    </div>
                    
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Action</label>
                        <button 
                            type='button' 
                            onClick={() => removeRow(id)} 
                            className='text-white bg-rose-500 rounded-md py-3 px-5'
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )
        };
        
        setInputRows(prevRows => [...prevRows, newRow]);
        setNextId(nextId + 1);
    }

    // Function to remove a specific row by ID
    const removeRow = (id) => {
        setInputRows(prevRows => prevRows.filter(row => row.id !== id));
        
        // Clean up associated data
        setTestData(prev => {
            const newData = { ...prev };
            delete newData.testNames[id];
            delete newData.testResults[id];
            delete newData.testFiles[id];
            delete newData.testDates[id];
            return newData;
        });
        
        setDateErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
        });
    };

    // Update test data in a centralized way
    const updateTestData = (category, id, value) => {
        setTestData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [id]: value
            }
        }));
    };
    
    const getFTDate = (date) => {
        setFTDate(date);
    };
    
    const getTestDateFn = (date, id) => {
        if (!date) {
            setDateErrors(prev => ({...prev, [id]: true}));
        } else {
            setDateErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[id];
                return newErrors;
            });
            updateTestData('testDates', id, date);
        }
    };
    
    const validateForm = () => {
        let isValid = true;
        
        // Check fluoride test date if any fluoride data exists
        const hasFluorideData = register3("rawFT")?.value || register3("treatedFT")?.value || fTFile;
        if (hasFluorideData && !fTDate) {
            toast.error("Fluoride test date is required");
            isValid = false;
        }
        
        // Check for missing test dates in dynamic rows
        for (const id of Object.keys(inputRows.map(row => row.id))) {
            if (testData.testNames[id] || testData.testResults[id] || testData.testFiles[id]) {
                if (!testData.testDates[id]) {
                    setDateErrors(prev => ({...prev, [id]: true}));
                    isValid = false;
                }
            }
        }
        
        return isValid;
    };

    const handleTestForm = async (formData) => {
        if (!validateForm()) {
            return;
        }
        
        try {
            // Transform test data for backend
            const groupedTests = Object.keys(testData.testDates).map(id => ({
                testId: id,
                testDate: testData.testDates[id],
                testName: testData.testNames[id],
                testResult: testData.testResults[id],
                testFileUrl: testData.testFiles[id]
            })).filter(test => test.testDate); // Only include tests with dates
            
            const fluorideTest = {
                raw: formData.rawFT || '',
                treated: formData.treatedFT || '',
                file: fTFile,
                date: fTDate
            };
    
            const res = await saveTestInfo(fluorideTest, groupedTests, formData.testClient);
            
            if (res.status === 201) {
                toast.success(res.message);
                setTimeout(() => window.location.reload(), 3000);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Error saving test info:", error);
            toast.error("Failed to save test information");
        }
    };

    return (
        <div className="flex m-5 flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div onClick={() => setTestFormOpen(!testFormOpen)} className="border-b border-stroke bg-blue-700 rounded-md text- px-6.5 py-4 dark:border-strokedark flex justify-between cursor-pointer">
                    <h3 className="font-medium text-white dark:text-white">FORM 3 - Test results Form</h3>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className={!testFormOpen ? `rotate-0 transition ease-in-out` : "rotate-45 transition ease-in-out"} color={"#fff"} fill={"none"}>
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <form onSubmit={handleSubmit3(handleTestForm)} id="test-results-form" className={`overflow-hidden transition-all duration-500 ease-in-out ${testFormOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="p-6.5">
                        <label className="mb-2.5 block text-black dark:text-white">Client</label>
                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                            <select 
                                {...register3("testClient", {required: "Client selection is required"})}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            >
                                <option value="" disabled="">Select Client</option>
                                {clientsLoading ? (
                                    <option value="">Loading data..</option>
                                ) : clients.length < 1 ? (
                                    <option value="" className='rounded-md border border-rose-500 mb-5 w-full bg-rose-200 p-5 text-center text-rose-700'>
                                        No Client has been registered yet.
                                    </option>
                                ) : (
                                    clients.map(client => (
                                        <option key={client._id} value={client._id} className="text-body dark:text-bodydark">
                                            {client.firstName + " " + client.lastName}
                                        </option>
                                    ))
                                )}
                            </select>
                            <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.8">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                        {errors3?.testClient && <div className='text-rose-500'>{errors3?.testClient?.message}</div>}
                    </div>
              
                    <div className="p-6.5">
                        <div className='heading-separator mb-7'>Fluoride Tests</div>
                        <div className="mb-6 flex-col gap-6 xl:grid xl:grid-cols-2">
                            <div className="mb-4.5 w-full">
                                <DatePicker 
                                    inputName="FTD" 
                                    labelName="Fluoride Test Date" 
                                    getDatefn={getFTDate} 
                                />
                                {!fTDate && register3("rawFT")?.value && <div className="text-rose-500">Fluoride test date is required</div>}
                            </div>
                            <div className="mb-4.5 w-full">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Raw Fluoride Test</label>
                                <input 
                                    placeholder="Enter Raw Fluoride results" 
                                    {...register3("rawFT")} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                                    type="text"
                                />
                            </div>
                            <div className="mb-4.5 w-full">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Treated Fluoride Test</label>
                                <input 
                                    placeholder="Enter Treated Fluoride results" 
                                    {...register3("treatedFT")} 
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                                    type="text"
                                />
                            </div>
                            <div className="mb-4.5 w-full relative">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Upload Fluoride Test Results</label>
                                <UploadButton 
                                    className="block ut-allowed-content:float-right w-full border-[1.5px] border-stroke bg-transparent rounded p-1.5 text-sm text-slate-500 ut-button:mr-4 ut-button:py-2 ut-button:px-4 ut-button:rounded-full ut-button:border-0 ut-button:text-sm ut-button:font-semibold ut-button:bg-violet-50 ut-button:text-violet-700 hover:ut-button:bg-violet-100 dark:border-form-strokedark" 
                                    endpoint="imageUploader" 
                                    onClientUploadComplete={(res) => {
                                        setFTFile(res[0].url);
                                        toast.success("Upload Completed");
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(`Upload Error: ${error.message}`);
                                    }}
                                /> 
                                <span className={`absolute top-0 right-0 ${fTFile ? "block" : "hidden"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#008000" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </span>                           
                            </div>
                        </div>
                        <div className='heading-separator'>Other Tests</div>
                        <div id="testInputParent">
                            {inputRows.map(row => row.component)}
                        </div>
                        <button 
                            id="addInputButton" 
                            type='button' 
                            onClick={() => addRow()} 
                            className="flex w-full justify-center rounded bg-orange-200 transition ease-in-out duration-500 text-orange-700 border border-orange-600 p-3 my-7 font-medium text-gray hover:bg-opacity-90 hover:bg-orange-600 hover:text-white"
                        >
                            Add Test Field
                        </button>
                        <button 
                            type='submit'  
                            className="flex w-full justify-center rounded bg-primary p-3 my-7 font-medium text-gray hover:bg-opacity-90"
                        >
                            Save Test Records
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TestForm;
import React from 'react';
import { Screen, ScreenProps } from '../../types';

const CvSetupScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [cvFile, setCvFile] = React.useState<File | null>(null);
    const [jobDesc, setJobDesc] = React.useState('');
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setCvFile(files[0]);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const canProceed = cvFile && jobDesc.trim().length > 50;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow w-full max-w-2xl p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-center mb-2">Setup Your Interview</h1>
                <p className="text-center text-slate-700 dark:text-slate-300 mb-6">Provide your CV and the job description to tailor the interview questions.</p>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="cv-upload" className="block text-sm font-medium mb-2">Upload Your CV (PDF)</label>
                        <label
                            htmlFor="file-upload"
                            className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-slate-500/50'}`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="text-center">
                                {cvFile ? (
                                    <div className="text-amber-600 dark:text-amber-300 font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="currentColor"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                                        <p className="mt-4">{cvFile.name}</p>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setCvFile(null); }} 
                                            className="text-xs text-red-500 hover:text-red-400 mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <div className="mt-4 flex items-center text-sm leading-6 text-slate-700 dark:text-slate-400">
                                            <span className="relative cursor-pointer rounded-md font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept=".pdf" />
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">PDF up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                    
                    <div>
                        <label htmlFor="job-description" className="block text-sm font-medium mb-2">Paste Job Description</label>
                        <textarea
                            id="job-description"
                            rows={8}
                            className="block w-full rounded-md border-0 bg-slate-500/10 py-1.5 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 transition"
                            placeholder="Paste the full job description here..."
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate(Screen.Parsing)}
                        disabled={!canProceed}
                        className="w-full btn-primary text-lg"
                    >
                        Analyze & Prepare Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CvSetupScreen;
import React from 'react';
import { Screen, ScreenProps } from '../../types';

const ProfileScreen: React.FC<ScreenProps> = ({ navigate }) => {
    
    const [cvFile, setCvFile] = React.useState<File | null>(null);
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

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Profile & Settings</h1>

                {/* Profile Information */}
                <div className="glass-card shadow-glass-glow p-6">
                    <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" id="name" defaultValue="Alex Doe" className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                                <input type="email" id="email" defaultValue="alex.doe@example.com" disabled className="block w-full rounded-md border-0 bg-slate-500/20 py-2 px-3 shadow-sm cursor-not-allowed text-slate-700 dark:text-slate-400" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button type="submit" className="btn-primary py-2 px-5">Save Changes</button>
                        </div>
                    </form>
                </div>
                
                {/* Change Password */}
                <div className="glass-card shadow-glass-glow p-6">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <form className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium mb-1">Current Password</label>
                                <input type="password" id="current_password" className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium mb-1">New Password</label>
                                <input type="password" id="new_password" className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <input type="password" id="confirm_password" className="block w-full rounded-md border-0 bg-slate-500/10 py-2 px-3 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button type="submit" className="btn-primary py-2 px-5">Update Password</button>
                        </div>
                    </form>
                </div>
                
                {/* Update CV */}
                <div className="glass-card shadow-glass-glow p-6">
                    <h2 className="text-xl font-bold mb-4">Your CV</h2>
                    <label
                        htmlFor="file-upload"
                        className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-slate-500/50'}`}
                        onDragEnter={handleDragEnter} onDragOver={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
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
                                    <div className="mt-4 flex text-sm leading-6 text-slate-700 dark:text-slate-400">
                                        <span className="relative cursor-pointer rounded-md font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
                                            <span>Upload a new CV</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept=".pdf" />
                                        </span>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">Currently using: alex_doe_cv.pdf</p>
                                </>
                            )}
                        </div>
                    </label>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={!cvFile} className="btn-primary py-2 px-5">Update CV</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;

import React, { useEffect } from 'react';

const Settings: React.FC<{ setPage: (p: string) => void }> = ({ setPage }) => {
  useEffect(() => {
    // Redirect to profile as editing is now handled live
    setPage('profile');
  }, [setPage]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Redirecting to Live Editor...</p>
    </div>
  );
};

export default Settings;

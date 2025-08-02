import React from 'react';
import HomeIcon from './icons/HomeIcon';
import SettingsIcon from './icons/SettingsIcons';
import TemplateIcon from './icons/TemplateIcon';
import RecordingIcon from './icons/RecordingIcon';

interface FooterMenuProps {
  activeTab?: 'home' | 'template' | 'recording' | 'settings';
  onTabChange?: (tab: 'home' | 'template' | 'recording' | 'settings') => void;
  isRecording?: boolean;
}

const FooterMenu: React.FC<FooterMenuProps> = ({ 
  activeTab = 'home', 
  onTabChange,
  isRecording = false 
}) => {
  const handleTabClick = (tab: 'home' | 'template' | 'recording' | 'settings') => {
    onTabChange?.(tab);
  };

  const getTabStyles = (tab: string) => {
    //const isActive = activeTab === tab;
    const isActive = false;
    return `
      flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200 ease-in-out
      ${isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }
      cursor-pointer min-w-0
    `.trim();
  };

  return (
    <footer className="
      sticky bottom-0 left-0 right-0 z-50
      bg-white border-t border-gray-200 
      px-4 py-1.5 safe-area-inset-bottom
      shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
    ">
      {/* Navigation Menu */}
      <nav className="flex items-center justify-evenly w-full max-w-lg mx-auto">
        
        {/* Home Tab */}
        <button
          className={getTabStyles('home')}
          onClick={() => handleTabClick('home')}
          aria-label="Home"
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center">
            <HomeIcon />
          </div>
          <span className="text-xs font-medium truncate">Home</span>
        </button>

        {/* Template Tab */}
        <button
          className={getTabStyles('template')}
          onClick={() => handleTabClick('template')}
          aria-label="Template"
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center">
            <TemplateIcon />
          </div>
          <span className="text-xs font-medium truncate">Template</span>
        </button>

        {/* Recording Tab */}
        <button
          className={getTabStyles('recording')}
          onClick={() => handleTabClick('recording')}
          aria-label="Recording"
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center relative">
            <RecordingIcon />
            {/* Recording indicator dot */}
            {isRecording && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-xs font-medium truncate">Recording</span>
        </button>

        {/* Settings Tab */}
        <button
          className={getTabStyles('settings')}
          onClick={() => handleTabClick('settings')}
          aria-label="Settings"
        >
          <div className="w-6 h-6 mb-1 flex items-center justify-center">
            <SettingsIcon />
          </div>
          <span className="text-xs font-medium truncate">Settings</span>
        </button>
      </nav>
    </footer>
  );
};

export default FooterMenu;

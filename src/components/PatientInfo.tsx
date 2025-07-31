// Removed unused imports: Avatar, AvatarFallback, AvatarImage, Button, Edit2, Calendar, Activity, FileText, Stethoscope, CreditCard, User
import { ProfileCard } from "./ProfileCard";
import { ToothButton } from "./icons/menu/chart";
import { ProgressNodesButton } from "./icons/menu/progress-note";
import { TxPlannerButton } from "./icons/menu/tx-planner";
import { LedgerButton } from "./icons/menu/ledger";
import { DocumentManagerButton } from "./icons/menu/document-manager";
import { AppoinmentsButton } from "./icons/menu/appointments";
import { PatienNotesButton } from "./icons/menu/patien-notes";

export function PatientInfo() {
  return (
    <div className="bg-white border border-gray-300 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-left">
        {/* Left side - Avatar and Patient Details */}
        <div className="flex items-center space-x-4">
          {/* Patient Avatar */}
        <ProfileCard  name="John" lastName="Smith" dob="1984-01-01" age={40} gender="M" />   
        {/* Vertical Separator */}
        <div className="h-12 w-px bg-gray-300 mx-4"></div>

        {/* Chart Section */}   
        <div className="flex flex-col mr-6">
            <label className="text-xs text-gray-500 mb-1">Chart #</label>
            <span className="text-sm font-semibold">JEFFCHART2</span>
        </div>

        {/* Vertical Separator */}
        <div className="h-12 w-px bg-gray-300 mx-4"></div>

        {/* Call me Dropdown Component */}
        <div className="flex flex-col mr-6">
          <label className="text-xs text-gray-500 mb-1">Call me</label>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-sm px-3 py-2 pr-8 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]">
              <option value="M (510) 449-5707">M (510) 449-5707</option>
              <option value="H (510) 555-0123">H (510) 555-0123</option>
              <option value="W (510) 555-0456">W (510) 555-0456</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Vertical Separator */}
        <div className="h-12 w-px bg-gray-300 mx-4"></div>

        {/* Primary Provider Section */}
        <div className="flex flex-col mr-6">
          <label className="text-xs text-gray-500 mb-1">Primary Provider</label>
          <span className="text-sm font-semibold">None</span>
        </div>

        {/* Vertical Separator */}
        <div className="h-12 w-px bg-gray-300 mx-4"></div>

        {/* Related Patients Section */}
        <div className="flex flex-col mr-6">
          <label className="text-xs text-gray-500 mb-1">Related Pacients</label>
          <span className="text-sm font-semibold">None</span>
        </div>

      </div>

        {/* Right side - Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap:'10px',
          maxWidth: '200px',
        }}>
          <ToothButton />
          <ProgressNodesButton />
          <TxPlannerButton />
          <LedgerButton />
          <DocumentManagerButton />
          <AppoinmentsButton />
          <PatienNotesButton />
        </div>
      </div>
    </div>
  );
} 

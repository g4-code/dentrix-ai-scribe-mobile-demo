import { Button } from "@/components/ui/button";
import { Settings, Calendar, FileText, DollarSign, AlertCircle, Clock } from "lucide-react";

// Simple chart component using CSS
function SimpleBarChart() {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Today'];
  
  return (
    <div className="h-48 w-full flex items-end justify-center space-x-4 px-4">
      {days.map((day) => (
        <div key={day} className="flex flex-col items-center space-y-2">
          <div className="w-8 h-32 bg-gray-200 rounded-t-sm flex items-end">
            <div className="w-full h-1 bg-blue-300 rounded-t-sm"></div>
          </div>
          <span className="text-xs text-gray-600 font-medium">{day}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardOverview() {
  return (
    <div className="bg-white border border-gray-300 shadow-sm rounded-t-lg overflow-hidden">
      {/* Overview Header */}
      <div className="px-6 py-3 border-b border-gray-300" style={{ backgroundColor: '#c1cadb' }}>
        <h1 className="text-lg font-semibold text-gray-800 font-roboto-flex">Overview</h1>
      </div>
      
      {/* Content */}
      <div className="p-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Unattached Procedures Card */}
        <div className="border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-teal-500 flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">Unattached Procedures</span>
              <span className="text-xs text-gray-600">(30 days)</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-4">
            <div className="flex">
              <div className="flex-1 text-left">
                <div className="text-4xl font-bold text-gray-900 leading-none">0</div>
                <div className="text-sm text-gray-600 mt-1">Patients</div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-4xl font-bold text-gray-900 leading-none">$0</div>
                <div className="text-sm text-gray-600 mt-1">Unpaid Procedures</div>
              </div>
            </div>
          </div>
        </div>

        {/* Unsent Claims Card */}
        <div className="border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">Unsent Claims</span>
              <span className="text-xs text-gray-600">(30 days)</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-4">
            <div className="flex">
              <div className="flex-1 text-left">
                <div className="text-4xl font-bold text-gray-900 leading-none">0</div>
                <div className="text-sm text-gray-600 mt-1">Claims</div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-4xl font-bold text-gray-900 leading-none">$0</div>
                <div className="text-sm text-gray-600 mt-1">Unpaid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Unresolved Claims Card */}
        <div className="border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">Unresolved Claims</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-4">
            <div className="flex">
              <div className="flex-1 text-left">
                <div className="text-4xl font-bold text-gray-900 leading-none">0</div>
                <div className="text-sm text-gray-600 mt-1">Claims</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold text-gray-900 leading-none">0</div>
                <div className="text-sm text-gray-600 mt-1">Rejected</div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-4xl font-bold text-gray-900 leading-none">$0</div>
                <div className="text-sm text-gray-600 mt-1">Unpaid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unconfirmed Appointments Card */}
        <div className="border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Unconfirmed Appointments</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <Settings className="w-3 h-3 text-gray-500" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-4">
            <SimpleBarChart />
          </div>
        </div>

        {/* Unscheduled Recare Card */}
        <div className="border border-gray-300 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          {/* Header */}
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-cyan-500 flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Unscheduled Recare</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <Settings className="w-3 h-3 text-gray-500" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-4">
            <div className="bg-blue-50 border border-blue-200 p-3 mb-6">
              <p className="text-sm text-blue-700">
                Automated email reminders are now available. 
                <a href="#" className="underline font-medium ml-1">Click here to get started</a>
              </p>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-600 font-medium">No unscheduled recare available</p>
            </div>
            
            <div className="flex justify-end">
              <select className="border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>All</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  );
} 
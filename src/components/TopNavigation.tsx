"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Home, Calendar, User, Settings, Users, HelpCircle, ChevronDown } from "lucide-react";
import Image from "next/image";
import { SettingsIcon } from "./icons/Settings";
import { LocationIcon } from "./icons/Location";
import { InfoIcon } from "./icons/Info";
import { HelpIcon } from "./icons/HiFi";
import { ThermometerIcon } from "./icons/Microphone";
import UserIcon from "./icons/User";
import CalendarIcon from "./icons/Calendar";
import HomeIcon from "./icons/Home";

interface TopNavigationProps {
  onVoiceAIClick: () => void;
}

export function TopNavigation({ onVoiceAIClick }: TopNavigationProps) {
  return (
    <nav className="text-white px-4 py-2 flex items-center justify-between shadow-md" style={{ backgroundColor: '#1b3667' }}>
      <div className="flex items-center space-x-6">
        {/* Left Navigation Items */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <HomeIcon/>
              Home
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
            <DropdownMenuItem>Reports</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <CalendarIcon />
              Schedule
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Appointment Book</DropdownMenuItem>
            <DropdownMenuItem>Scheduling List</DropdownMenuItem>
            <DropdownMenuItem>Wait List</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <UserIcon />
              Patient
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Patient Chart</DropdownMenuItem>
            <DropdownMenuItem>Patient Search</DropdownMenuItem>
            <DropdownMenuItem>New Patient</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-10 pr-2 bg-white text-gray-900 border border-gray-400 shadow-none rounded-none h-8" 
              placeholder="Antonio C Galicia"
              defaultValue="Antonio C Galicia"
              readOnly
            />
          </div>
          <Button 
            className="h-8 w-8 p-0 rounded-none border-none bg-blue-500 hover:bg-blue-600 flex items-center justify-center" 
            style={{ backgroundColor: '#4a90e2' }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="5 5 16 16" 
              className="w-6 h-6"
            >
              <path 
                fill="#FFFFFF" 
                d="M15,10.7L15,10.7c0,0,0.8-0.3,1-1.7c0.5,0,1-2,0-2c0-2,0-4-3-4c-3,0-3,2-3,4c-1,0-0.5,2,0,2c0.2,1.4,1,2,1,2  l0,1c-5,1.7-6,2.1-6,6h9.7C11.3,15.2,14,10.7,15,10.7z M17.5,11c-1.9,0-3.5,1.6-3.5,3.5c0,1.9,1.6,3.5,3.5,3.5  c1.9,0,3.5-1.6,3.5-3.5C21,12.6,19.4,11,17.5,11z M17.5,17c-1.4,0-2.5-1.1-2.5-2.5c0-1.4,1.1-2.5,2.5-2.5c1.4,0,2.5,1.1,2.5,2.5  C20,15.9,18.9,17,17.5,17z M18,15v-2h-1v3l2,0l0-1H18z M13,23l3-3h-6L13,23z"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Icon Button */}
      <div className="mx-4">
        <Button 
          className="w-10 h-10 p-0 rounded-full flex items-center justify-center border-none hover:opacity-90 transition-opacity overflow-visible cursor-pointer"
          style={{ 
            backgroundColor: '#003C80',
            boxShadow: '2px 2px 8px rgba(2, 2, 3, 0.08)',
          }}
          onClick={onVoiceAIClick}
        >
          <ThermometerIcon width={52} height={52} />
        </Button>
      </div>

      {/* Right Navigation Items */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <SettingsIcon/>
              Settings
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Practice Setup</DropdownMenuItem>
            <DropdownMenuItem>User Setup</DropdownMenuItem>
            <DropdownMenuItem>System Preferences</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <LocationIcon />
              KBARK
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Administrator</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="text-white nav-button-hover">
          <InfoIcon />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white nav-button-hover flex items-center gap-1">
              <HelpIcon />
              Antonio
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
} 
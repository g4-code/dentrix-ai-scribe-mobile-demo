import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MessageIcon } from "./icons/Message";
import { PencilIcon } from "./icons/Pencil";

interface ProfileCardProps {
  name: string;
  nickname?: string;
  lastName: string;
  specialty: string;
  dob: string;
  age: number;
  gender: "M" | "F";
}

export const ProfileCard = ({
  name,
  nickname,
  lastName,
  specialty,
  dob,
  age,
  gender,
}: ProfileCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
          <Image src="/images/profile.png" alt="Profile" width={40} height={40} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
          <span>
            {name} {nickname && `(${nickname})`} {lastName}
          </span>
          <PencilIcon />
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 fill-green-600 text-green-600" />
          <span>
            {new Date(dob).toLocaleDateString("en-US")} ({age}) {gender}
          </span>
          <MessageIcon/>

        </div>
      </div>
    </div>
  );
};

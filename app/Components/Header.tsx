import { useAuth } from "@/context/authContext";
import { signOutUser } from "@/firebase/auth";
import { Bell, Menu, PlusCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await signOutUser();
        router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    const NavItem = ({
      icon,
      label,
      active = false,
      onClick,
    }: {
      icon: React.ReactNode;
      label: string;
      active?: boolean;
      onClick?: () => void;
    }) => (
      <div
        onClick={onClick}
        className={`flex items-center space-x-1 cursor-pointer ${
          active ? "text-[#83A2DB]" : "text-gray-300 hover:text-white"
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    );
  
    return (
      <nav className="w-full bg-gray-900 text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#83A2DB]">HabitSync</span>
          </div>
  
          <div className="hidden md:flex items-center space-x-6">
            <NavItem icon={<User size={18} />} label="Logout" onClick={handleLogout} />
          </div>
  
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
  
        {isOpen && (
          <div className="flex flex-col space-y-4 px-6 pb-4 md:hidden">
            <NavItem icon={<Bell size={18} />} label="Notifications" active />
            <NavItem icon={<PlusCircle size={18} />} label="Set Goal" />
            <NavItem icon={<User size={18} />} label="Profile" />
          </div>
        )}
      </nav>
    );
}

  export default Header;
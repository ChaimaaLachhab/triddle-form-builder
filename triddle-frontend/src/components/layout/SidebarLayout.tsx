import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, BarChart2, BookOpen, HelpCircle, FileIcon, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigationItems = [
    { name: 'My Forms', path: '/dashboard', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-white w-full">
      {/* Fixed Sidebar - 20% width */}
      <aside className="hidden md:flex flex-col fixed h-screen w-1/5 bg-sidebar text-white">
        <div className="p-4 flex items-center">
          <FileIcon className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-white">Form Builder</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === '/dashboard' && pathname!.includes('/form/'));

              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center px-6 py-3 text-[15px] hover:bg-accent rounded",
                      isActive && "bg-accent"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <Link
            href="/profile"
            className="flex w-full items-center px-6 py-3 text-[15px] hover:bg-sidebar-accent rounded"
          >
            <User className="mr-3 h-5 w-5" />
            My Profile
          </Link>
          <button
            onClick={() => console.log('Logout clicked')}
            className="flex w-full items-center px-6 py-3 text-[15px] hover:bg-sidebar-accent rounded mt-2"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50",
                  isActive && "text-blue-600"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
          {/* User profile dropdown */}
          <div className="relative flex items-center justify-center">
            {(() => {
              const isActive = pathname === "/profile";
              return (
                <>
                  <button
                    onClick={toggleDropdown}
                    className={cn(
                      "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50",
                      isActive && "text-blue-600"
                    )}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-xs">Profile</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute bottom-12 right-0 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          console.log('Logout clicked');
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Main content - 80% width with offset for sidebar */}
      <main className="p-4 md:ml-1/5 md:w-4/5 lg:w-4/5 w-full">
        <div className="md:ml-1/5 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
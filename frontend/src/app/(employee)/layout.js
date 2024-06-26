import EmployeeNavbar from "@/components/EmployeeNavbar"
import LeftSidebar from "@/components/LeftSidebar"
import "../globals.css";

export const metadata = {
  title: 'Employee',
  description: 'Employee View',
};

export default function EmployeeLayout({ children }) {
 return (
    <html lang="en">
      <body className="flex flex-row min-h-screen" aria-label= "Employee Dashboard">
      <LeftSidebar />
      <div className="flex flex-col w-full">
        {children}
      </div>
      </body>
    </html>
  )
}

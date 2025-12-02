import { Avatar, Breadcrumb, Dropdown } from "antd"
import { Header } from "antd/es/layout/layout"
import { Bell, MoreVertical } from "lucide-react"
import React from "react"

const AdminHeader = ({ collapsed, setCollapsed, currentTitle }: any) => {
    return (
        <Header className="p-0 px-8 flex items-center justify-between z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20">
            <div className="flex items-center gap-4">
            {React.createElement(MoreVertical, {
                className: 'trigger text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors rotate-90',
                onClick: () => setCollapsed(!collapsed),
            })}
            <Breadcrumb items={[{ title: 'Admin' }, { title: currentTitle }]} className="hidden md:flex" />
            </div>
            
            <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
                <Bell size={22} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200"></div>

            <Dropdown menu={{ items: [{ key: '1', label: 'Hồ sơ cá nhân' }, { key: '2', label: 'Cài đặt' }, { type: 'divider' }, { key: '3', label: 'Đăng xuất', danger: true }] }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Avatar src="https://i.pravatar.cc/150?u=admin" size={40} className="border-2 border-white shadow-sm" />
                <div className="hidden md:block leading-tight mr-2">
                    <div className="font-bold text-sm text-gray-800">Admin User</div>
                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">SUPER ADMIN</div>
                </div>
                </div>
            </Dropdown>
            </div>
        </Header>
    )
}
export default AdminHeader
import { Button, Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { PlayCircle } from "lucide-react"
import { menuItems } from "../../db"
// 1. Import hook useNavigate từ react-router-dom
import { useNavigate } from "react-router-dom" 

const AdminSidebar = ({ collapsed, setCollapsed, selectedKey, setSelectedKey }: any) => {
    // 2. Khởi tạo instance điều hướng
    const navigate = useNavigate(); 

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={260}
            className="border-r border-slate-800 z-20 !bg-[#0f172a]"
            trigger={null}
        >
            <div className="h-20 flex items-center justify-center">
                <div className="flex items-center gap-3 text-white font-bold text-2xl tracking-tight">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <PlayCircle size={24} className="text-white" />
                    </div>
                    {!collapsed && <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CineAdmin</span>}
                </div>
            </div>
            
            <div className="px-2 mb-6">
                {!collapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu chính</p>}
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    // 3. Cập nhật logic onClick: Vừa set state giao diện, vừa chuyển hướng
                    onClick={(e) => {
                        setSelectedKey(e.key);
                        navigate(e.key); 
                    }}
                    className="!bg-transparent border-none font-medium"
                />
            </div>

            {!collapsed && (
            <div className="absolute bottom-8 left-0 w-full px-6">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">PRO</div>
                        <div>
                            <p className="text-white text-xs font-bold m-0">Gói Doanh Nghiệp</p>
                            <p className="text-slate-400 text-[10px] m-0">Hết hạn sau 12 ngày</p>
                        </div>
                    </div>
                    <Button type="primary" size="small" block className="bg-indigo-600 border-none text-xs font-semibold">Gia hạn ngay</Button>
                </div>
            </div>
            )}
        </Sider>
    )
}

export default AdminSidebar
import React, { useState } from "react";
import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";
import { menuItems } from "../db";
import AdminSidebar from "./layouts/SideBar";
import AdminHeader from "./layouts/Header";
import AdminFooter from "./layouts/Footer";

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const currentTitle = menuItems.find(i => i.key === selectedKey)?.label;

  // Cấu hình kích thước Sidebar
  const SIDER_WIDTH = 260;
  const COLLAPSED_WIDTH = 80;

  const customTheme = {
    token: {
      colorPrimary: '#4f46e5',
      fontFamily: '"Inter", sans-serif',
      borderRadius: 8,
      colorBgLayout: '#f8fafc',
    },
    components: {
      Menu: { itemBg: 'transparent', itemColor: '#94a3b8', itemSelectedColor: '#fff', itemSelectedBg: '#4f46e5', itemHeight: 50, itemMarginInline: 12, itemBorderRadius: 12 },
      Table: { headerBg: 'transparent', headerColor: '#64748b', rowHoverBg: '#f1f5f9' },
      Button: { controlHeightLG: 44 }
    }
  };

  return (
     <ConfigProvider theme={customTheme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* Đảm bảo Sidebar của Antd luôn full chiều cao */
        .ant-layout-sider { height: 100% !important; }
        
        /* Scrollbar đẹp */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
      
      {/* 1. CONTAINER CHÍNH: Dùng Flex Row để chia màn hình làm 2 phần trái/phải */}
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        
        {/* 2. KHU VỰC SIDEBAR (Bên Trái) */}
        {/* flex-none: Không cho phép co giãn, giữ cứng kích thước */}
        <div 
            className="flex-none h-full bg-[#0f172a] transition-all duration-200 ease-in-out relative z-20"
            style={{ width: collapsed ? COLLAPSED_WIDTH : SIDER_WIDTH }}
        >
            <AdminSidebar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                selectedKey={selectedKey} 
                setSelectedKey={setSelectedKey} 
            />
        </div>

        {/* 3. KHU VỰC NỘI DUNG (Bên Phải) */}
        {/* flex-1: Tự động chiếm TẤT CẢ khoảng trống còn lại -> Sửa lỗi khoảng đen bên phải */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8fafc] relative min-w-0">
          
          {/* Header dính ở trên cùng khi cuộn nội dung */}
          <div className="sticky top-0 z-10 w-full">
             <AdminHeader 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                currentTitle={currentTitle} 
             />
          </div>

          {/* Phần nội dung chính (Outlet) */}
          <main className="flex-1 m-4 md:m-8">
             <Outlet />
          </main>

          <AdminFooter />

        </div>
      </div>
    </ConfigProvider>
  );
};

export default AdminLayout;
import { Avatar, Button, Input, Select, Switch, Tabs } from "antd";
import { AlertCircle, Bell, CreditCard, Edit, Globe, Lock, Option, UploadCloud, User, Users } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-800 m-0">Cài đặt hệ thống</h2>
        <p className="text-gray-500 mt-2">Quản lý các tùy chọn hiển thị và cấu hình tài khoản của bạn</p>
      </div>

      <Tabs 
        defaultActiveKey="1" 
        tabBarStyle={{ marginBottom: 32 }}
        items={[
        {
          key: '1',
          label: <span className="flex items-center gap-2 px-2 py-1"><Globe size={18}/> Tổng quan</span>,
          children: (
            <div className="max-w-3xl mx-auto py-2 space-y-8 animate-fade-in">
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Tên trang web</label>
                     <Input size="large" defaultValue="CineAdmin Movie Portal" className="rounded-xl shadow-sm hover:border-indigo-400 focus:border-indigo-500" prefix={<span className="text-gray-400 mr-1">Draft:</span>} />
                     <p className="text-xs text-gray-400 mt-1.5">Tên này sẽ hiển thị trên tiêu đề tab trình duyệt và trang chủ.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Ngôn ngữ mặc định</label>
                         <Select size="large" defaultValue="vi" className="w-full" popupClassName="rounded-xl">
                            <Option value="vi">🇻🇳 Tiếng Việt</Option>
                            <Option value="en">🇺🇸 English</Option>
                         </Select>
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-2">Múi giờ hệ thống</label>
                         <Select size="large" defaultValue="hcm" className="w-full" popupClassName="rounded-xl">
                            <Option value="hcm">(GMT+07:00) Bangkok, Hanoi, Jakarta</Option>
                            <Option value="utc">(GMT+00:00) UTC</Option>
                         </Select>
                      </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                   <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <h4 className="font-semibold text-gray-800 m-0 flex items-center gap-2">
                            <AlertCircle size={16} className="text-orange-500"/>
                            Chế độ bảo trì
                        </h4>
                        <p className="text-gray-500 text-sm mt-1 m-0">Khi bật, chỉ Admin mới có thể truy cập trang web. Người dùng sẽ thấy trang "Đang bảo trì".</p>
                      </div>
                      <Switch className="bg-gray-300" />
                   </div>
               </div>

               <div className="flex justify-end pt-4 border-t border-gray-50">
                   <Button type="primary" size="large" className="bg-indigo-600 hover:bg-indigo-500 h-11 px-8 rounded-xl shadow-lg shadow-indigo-200 border-none font-medium">
                       Lưu thay đổi
                   </Button>
               </div>
            </div>
          )
        },
        {
          key: '2',
          label: <span className="flex items-center gap-2 px-2 py-1"><User size={18}/> Tài khoản</span>,
          children: (
            <div className="max-w-3xl mx-auto py-2 space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-indigo-50 to-white p-8 rounded-2xl border border-indigo-50">
                <div className="relative group cursor-pointer">
                    <Avatar size={100} src="https://i.pravatar.cc/150?u=admin" className="border-4 border-white shadow-md group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="text-white" size={24} />
                    </div>
                </div>
                <div className="text-center md:text-left">
                   <h3 className="text-xl font-bold text-gray-800 m-0">Admin User</h3>
                   <p className="text-indigo-600 font-medium text-sm mt-1">Super Administrator</p>
                   <div className="flex gap-3 mt-4 justify-center md:justify-start">
                       <Button icon={<UploadCloud size={16} />} className="rounded-lg">Tải ảnh mới</Button>
                       <Button danger type="text" className="rounded-lg">Xóa ảnh</Button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
                      <Input size="large" defaultValue="Admin User" className="rounded-xl" suffix={<Edit size={16} className="text-gray-400"/>} />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email đăng nhập</label>
                      <Input size="large" defaultValue="admin@cineadmin.com" disabled className="rounded-xl bg-gray-50 text-gray-500" suffix={<Lock size={16} className="text-gray-400"/>} />
                  </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lock size={18} className="text-indigo-600" />
                    Bảo mật & Mật khẩu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu hiện tại</label>
                        <Input.Password size="large" placeholder="••••••••" className="rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu mới</label>
                        <Input.Password size="large" placeholder="Nhập mật khẩu mới" className="rounded-xl" />
                    </div>
                     <div className="col-span-2 flex justify-end">
                         <Button type="dashed" className="text-indigo-600 border-indigo-300 bg-indigo-50">Đổi mật khẩu</Button>
                     </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                  <Button type="primary" size="large" className="bg-indigo-600 hover:bg-indigo-500 h-11 px-8 rounded-xl shadow-lg shadow-indigo-200 border-none font-medium">
                       Lưu hồ sơ
                   </Button>
              </div>
            </div>
          )
        },
        {
          key: '3',
          label: <span className="flex items-center gap-2 px-2 py-1"><Bell size={18}/> Thông báo</span>,
          children: (
            <div className="max-w-3xl mx-auto py-2 space-y-6 animate-fade-in">
               <div className="bg-blue-50 p-4 rounded-xl flex gap-3 mb-6 border border-blue-100">
                   <div className="bg-blue-100 p-2 rounded-lg h-fit text-blue-600"><Bell size={20}/></div>
                   <div>
                       <h4 className="text-blue-900 font-semibold m-0 text-sm">Kiểm soát thông báo</h4>
                       <p className="text-blue-700 text-xs m-0 mt-1">Chọn những loại thông báo bạn muốn nhận qua email hoặc hệ thống.</p>
                   </div>
               </div>

               <div className="space-y-4">
               {[
                 { title: "Thông báo đăng ký mới", desc: "Nhận email khi có người dùng đăng ký tài khoản mới", icon: <Users size={18} className="text-green-500"/> },
                 { title: "Báo cáo doanh thu tuần", desc: "Nhận báo cáo tổng hợp doanh thu vào thứ Hai hàng tuần", icon: <CreditCard size={18} className="text-yellow-500"/> },
                 { title: "Cảnh báo hệ thống & Lỗi", desc: "Thông báo ngay lập tức khi server quá tải hoặc gặp lỗi nghiêm trọng", icon: <AlertCircle size={18} className="text-red-500"/> },
                 { title: "Tin tức cập nhật & Tính năng", desc: "Nhận thông tin về các bản cập nhật tính năng mới từ CineAdmin", icon: <Globe size={18} className="text-indigo-500"/> }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all bg-white group">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                          {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm m-0 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                        <p className="text-gray-500 text-xs m-0 mt-1 max-w-md">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={idx !== 3} className="bg-gray-200 hover:bg-gray-300" />
                 </div>
               ))}
               </div>
               
               <div className="flex justify-end pt-6 mt-6 border-t border-gray-50">
                   <Button size="large" className="mr-3 rounded-xl">Mặc định</Button>
                   <Button type="primary" size="large" className="bg-indigo-600 hover:bg-indigo-500 h-11 px-8 rounded-xl shadow-lg shadow-indigo-200 border-none font-medium">
                       Lưu cấu hình
                   </Button>
               </div>
            </div>
          )
        }
      ]} />
    </div>
  );
}

export default SettingsPage
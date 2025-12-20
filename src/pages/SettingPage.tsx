import { Avatar, Input, Select, Tabs, message } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import {
  Bell,
  Edit,
  Globe,
  Lock,
  User
} from "lucide-react";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  // ✅ STATE CHO TAB 2
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ CHỈ PHỤC VỤ TAB 2
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = JSON.parse(localStorage.getItem("user") || "null");

        if (!token || !email) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://api-class-o1lo.onrender.com/api/khanhphuong/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const users = res.data.data;
        const currentUser = users.find((u: any) => u.email === email);

        setUser(currentUser);
      } catch (error) {
        console.error(error);
        message.error("Không lấy được thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);


  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-800 m-0">
          Cài đặt hệ thống
        </h2>
        <p className="text-gray-500 mt-2">
          Quản lý các tùy chọn hiển thị và cấu hình tài khoản của bạn
        </p>
      </div>

      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ marginBottom: 32 }}
        items={[
          /* ================= TAB 1 ================= */
          {
            key: "1",
            label: (
              <span className="flex items-center gap-2 px-2 py-1">
                <Globe size={18} /> Tổng quan
              </span>
            ),
            children: (
              <div className="max-w-3xl mx-auto py-2 space-y-8 animate-fade-in">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên trang web
                    </label>
                    <Input
                      size="large"
                      defaultValue="CineAdmin Movie Portal"
                      className="rounded-xl"
                      prefix={
                        <span className="text-gray-400 mr-1">Draft:</span>
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngôn ngữ mặc định
                      </label>
                      <Select size="large" defaultValue="vi" className="w-full">
                        <Option value="vi">🇻🇳 Tiếng Việt</Option>
                        <Option value="en">🇺🇸 English</Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Múi giờ hệ thống
                      </label>
                      <Select size="large" defaultValue="hcm" className="w-full">
                        <Option value="hcm">
                          (GMT+07:00) Bangkok, Hanoi
                        </Option>
                        <Option value="utc">(GMT+00:00) UTC</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },

          /* ================= TAB 2 (ĐÃ SỬA LOGIC) ================= */
          {
            key: "2",
            label: (
              <span className="flex items-center gap-2 px-2 py-1">
                <User size={18} /> Tài khoản
              </span>
            ),
            children: (
              <div className="max-w-3xl mx-auto py-2 space-y-8 animate-fade-in">
                {loading ? (
                  <div className="text-center text-gray-400 py-20">
                    Đang tải thông tin tài khoản...
                  </div>
                ) : !user ? (
                  <div className="text-center text-red-500 py-20">
                    Không tìm thấy tài khoản đăng nhập
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-indigo-50 to-white p-8 rounded-2xl border border-indigo-50">
                      <Avatar
                        size={100}
                        src={user.avatar || "https://i.pravatar.cc/150"}
                        className="border-4 border-white shadow-md"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {user.username}
                        </h3>
                        <p className="text-indigo-600 text-sm">
                          {user.role === "admin"
                            ? "Super Administrator"
                            : "User"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tên hiển thị
                        </label>
                        <Input
                          size="large"
                          value={user.username}
                          disabled
                          suffix={<Edit size={16} />}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          size="large"
                          value={user.email}
                          disabled
                          suffix={<Lock size={16} />}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <Input size="large" value={user.phone || ""} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
          },


          /* ================= TAB 3 ================= */
          {
            key: "3",
            label: (
              <span className="flex items-center gap-2 px-2 py-1">
                <Bell size={18} /> Thông báo
              </span>
            ),
            children: <div className="py-20 text-center">OK</div>,
          },
        ]}
      />
    </div>
  );
};

export default SettingsPage;

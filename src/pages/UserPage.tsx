import { useEffect, useState } from "react";
import { Avatar, Table, Tag, Input, Button, Popconfirm, message, Space, Tooltip } from "antd";
import { Search, UserCog, RefreshCcw, Lock, Unlock } from "lucide-react"; // Import icon Lock/Unlock
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUsers, toggleLockUser } from "../redux/slices/userSlice";

const UsersPage = () => {
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector((state) => state.users);
    
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // 🔥 HÀM XỬ LÝ KHOÁ TÀI KHOẢN
    const handleToggleLock = async (id: string, currentStatus: string) => {
        try {
            // Mặc định nếu không có status thì coi như là active
            const status = currentStatus || 'active';
            await dispatch(toggleLockUser({ id, currentStatus: status })).unwrap();
            
            const actionText = status === 'active' ? 'Khoá' : 'Mở khoá';
            message.success(`Đã ${actionText} tài khoản thành công`);
        } catch (error) {
            message.error("Thao tác thất bại: " + error);
        }
    };

    const filteredUsers = users.filter((user: any) => 
        (user.username?.toLowerCase().includes(searchText.toLowerCase())) || 
        (user.email?.toLowerCase().includes(searchText.toLowerCase()))
    );

    const columns = [
        {
            title: 'NGƯỜI DÙNG',
            dataIndex: 'username', 
            key: 'username', 
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        src={record.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.username}`} 
                        size="large" 
                        // Đổi màu nền avatar nếu bị khoá
                        className={record.status === 'banned' ? "grayscale opacity-50" : "bg-indigo-100 text-indigo-600"} 
                    />
                    <div>
                        <div className={`font-semibold ${record.status === 'banned' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {record.username || "Chưa đặt tên"}
                        </div>
                        <div className="text-xs text-gray-400">{record.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'VAI TRÒ',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'purple' : 'blue'} className="rounded-full px-3 capitalize font-bold">
                    {role || 'user'}
                </Tag>
            )
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'status', // Sử dụng trường status thật
            key: 'status',
            render: (status: string) => {
                const isActive = status !== 'banned'; // Mặc định null/undefined là active
                return (
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                        isActive 
                        ? 'text-green-600 bg-green-50 border-green-100' 
                        : 'text-red-600 bg-red-50 border-red-100'
                    }`}>
                        {isActive ? 'Hoạt động' : 'Đã khoá'}
                    </span>
                )
            }
        },
        {
            title: 'HÀNH ĐỘNG',
            key: 'action',
            render: (_: any, record: any) => {
                const isActive = record.status !== 'banned';
                
                return (
                <Space size="middle">
                    
                    
                    {/* 🔥 NÚT KHOÁ / MỞ KHOÁ */}
                    <Popconfirm
                        title={isActive ? "Khoá tài khoản này?" : "Mở khoá tài khoản?"}
                        description={isActive ? "Người dùng sẽ không thể đăng nhập." : "Người dùng sẽ hoạt động trở lại."}
                        onConfirm={() => handleToggleLock(record._id, record.status)}
                        okText={isActive ? "Khoá ngay" : "Mở khoá"}
                        cancelText="Huỷ"
                        okButtonProps={{ danger: isActive }} // Màu đỏ nếu là hành động Khoá
                    >
                        <Tooltip title={isActive ? "Khoá tài khoản" : "Mở khoá"}>
                            <Button 
                                type="text" 
                                // Nếu đang active -> Hiện icon Khoá (màu cam/đỏ). Nếu đang khoá -> Hiện icon Mở (màu xanh)
                                className={isActive ? "text-orange-500 hover:text-orange-600" : "text-green-600 hover:text-green-700"}
                                icon={isActive ? <Lock size={18} /> : <Unlock size={18} />} 
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )},
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <UserCog size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">Quản Lý Người Dùng</h2>
                        <p className="text-gray-400 text-xs m-0">Tổng số: {users.length} tài khoản</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Input 
                        prefix={<Search size={16} className="text-gray-400" />} 
                        placeholder="Tìm người dùng..." 
                        className="rounded-lg py-2"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                    <Button icon={<RefreshCcw size={16}/>} onClick={() => dispatch(fetchUsers())}>
                        Tải lại
                    </Button>
                </div>
             </div>

             <Table 
                dataSource={filteredUsers} 
                rowKey="_id" 
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 6 }} 
                className="custom-table"
            />
        </div>
    );
};

export default UsersPage;
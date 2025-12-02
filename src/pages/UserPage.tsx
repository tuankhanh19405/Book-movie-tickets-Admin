import { Avatar, Table, Tag } from "antd";
import { initialUsers } from "../db";

const UsersPage = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <div className="mb-6"><h2 className="text-xl font-bold text-gray-800 m-0">Người dùng</h2></div>
         <Table dataSource={initialUsers} rowKey="id" pagination={false} className="custom-table"
            columns={[
            { title: 'NGƯỜI DÙNG', dataIndex: 'name', key: 'name', render: (text, r) => (<div className="flex items-center gap-3"><Avatar src={r.avatar} size="large" /><div><div className="font-semibold text-gray-800">{text}</div><div className="text-xs text-gray-400">{r.email}</div></div></div>)},
            { title: 'GÓI DỊCH VỤ', dataIndex: 'role', key: 'role', render: (role) => (<Tag color={role === 'Premium' ? 'gold' : 'blue'} className="rounded-full px-3">{role}</Tag>)},
            { title: 'TRẠNG THÁI', dataIndex: 'status', key: 'status', render: (st) => (<span className={`text-xs font-bold px-2 py-1 rounded ${st === 'Active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{st}</span>)},
            ]}
        />
    </div>
);
export default UsersPage
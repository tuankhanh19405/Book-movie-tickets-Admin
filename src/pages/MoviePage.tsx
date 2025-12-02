import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tag } from "antd";
import { AlertCircle, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { initialMovies } from "../db";

const MoviesPage = () => {
  const [movies, setMovies] = useState(initialMovies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const handleEdit = (record: any) => {
    setEditingMovie(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa phim?',
      icon: <AlertCircle className="text-red-500" />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa ngay',
      okType: 'danger',
      onOk: () => {
        setMovies(movies.filter(m => m.id !== id));
        message.success('Đã xóa phim thành công');
      }
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingMovie) {
        setMovies(movies.map(m => m.id === editingMovie.id ? { ...m, ...values } : m));
        message.success('Cập nhật thành công');
      } else {
        const newMovie = {
          id: Date.now().toString(),
          views: 0,
          poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=100&h=150',
          ...values
        };
        setMovies([newMovie, ...movies]);
        message.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingMovie(null);
    });
  };

  const columns = [
    {
      title: 'THÔNG TIN PHIM',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-4 py-2">
          <img src={record.poster} alt="poster" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
          <div>
            <div className="font-bold text-gray-800 text-base">{text}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span>{record.year}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{record.director}</span>
            </div>
          </div>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: any) => record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'THỂ LOẠI',
      dataIndex: 'genre',
      key: 'genre',
      render: (genres: string[]) => (
        <div className="flex flex-wrap gap-1">
          {genres.map(tag => (
            <Tag key={tag} bordered={false} className="bg-gray-100 text-gray-600 rounded-md px-2 py-1 text-xs font-medium">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'LƯỢT XEM',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: any, b: any) => a.views - b.views,
      render: (views: number) => <span className="font-semibold text-gray-700">{views.toLocaleString()}</span>,
    },
    {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'Published' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              {status}
          </div>
        ),
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" shape="circle" icon={<Edit size={16} className="text-gray-500 hover:text-indigo-600" />} onClick={() => handleEdit(record)} />
          <Button type="text" shape="circle" icon={<Trash2 size={16} className="text-gray-500 hover:text-red-500" />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 m-0">Danh sách phim</h2>
            <p className="text-gray-500 text-sm mt-1">Quản lý kho nội dung của bạn</p>
        </div>
        <Space size="middle">
          <Input placeholder="Tìm kiếm phim..." prefix={<Search size={18} className="text-gray-400" />} onChange={e => setSearchText(e.target.value)} className="w-64 rounded-xl" size="large" />
          <Button size="large" icon={<Filter size={18} />} className="rounded-xl border-gray-200">Lọc</Button>
          <Button type="primary" size="large" icon={<Plus size={18} />} onClick={() => { setEditingMovie(null); form.resetFields(); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl border-none">Thêm Phim</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={movies} rowKey="id" pagination={{ pageSize: 5 }} className="custom-table" />
      <Modal title={editingMovie ? "Cập nhật" : "Thêm mới"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={600}>
        <Form form={form} layout="vertical" initialValues={{ status: 'Draft' }} className="mt-6">
          <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}><Input size="large" className="rounded-lg" /></Form.Item>
          <Row gutter={16}>
             <Col span={12}><Form.Item name="director" label="Đạo diễn" rules={[{ required: true }]}><Input size="large" className="rounded-lg" /></Form.Item></Col>
             <Col span={12}><Form.Item name="year" label="Năm" rules={[{ required: true }]}><Input type="number" size="large" className="rounded-lg" /></Form.Item></Col>
          </Row>
          <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}><Select mode="tags" size="large"><Option value="Action">Action</Option><Option value="Drama">Drama</Option></Select></Form.Item>
          <Form.Item name="status" label="Trạng thái"><Select size="large"><Option value="Published">Published</Option><Option value="Draft">Draft</Option></Select></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MoviesPage
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tag } from "antd";
import { AlertCircle, Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Import Redux Hooks & Actions
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMovies, updateMovie, stopShowingMovie, createMovie } from "../redux/slices/movieSlice";
import type { Movie } from "../interface/type";

const { Option } = Select;

const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const { list: movies, loading } = useAppSelector((state) => state.movie);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Lấy dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Mở Modal Sửa
  const handleEdit = (record: Movie) => {
    setEditingMovie(record);
    form.setFieldsValue({
      ...record,
      genre: record.genres, // Map từ API 'genres' sang Form 'genre'
      year: record.release_date ? new Date(record.release_date).getFullYear() : new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  // Xử lý Xóa (Dừng chiếu)
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Dừng chiếu phim?',
      icon: <AlertCircle className="text-red-500" />,
      content: 'Phim sẽ chuyển sang trạng thái "Ended".',
      okText: 'Xác nhận',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(stopShowingMovie(id)).unwrap();
          message.success('Đã dừng chiếu phim');
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  // Xử lý khi bấm OK ở Modal (Thêm hoặc Sửa)
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingMovie) {
          // --- LOGIC SỬA ---
          const updatedData: Movie = {
            ...editingMovie,
            title: values.title,
            director: values.director,
            genres: values.genre,
            status: values.status,
            // Giữ nguyên ngày phát hành cũ
            release_date: editingMovie.release_date, 
          };
          await dispatch(updateMovie(updatedData)).unwrap();
          message.success('Cập nhật thành công');

        } else {
          // --- LOGIC THÊM MỚI ---
          // Tạo dữ liệu giả cho các trường thiếu
          const newMovieData: Omit<Movie, '_id'> = {
            title: values.title,
            director: values.director,
            genres: values.genre || [],
            status: values.status || 'released',
            release_date: new Date(values.year, 0, 1).toISOString(), // Convert Year -> ISO Date
            
            // Default Values (Vì Form UI thiếu các trường này)
            slug: values.title.toLowerCase().replace(/ /g, '-'),
            description: "Mô tả phim mặc định...",
            duration_min: 120,
            poster_url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=100&h=150",
            cast: [],
            rating_stats: { average: 0, count: 0 }
          };

          await dispatch(createMovie(newMovieData)).unwrap();
          message.success('Thêm phim mới thành công');
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingMovie(null);

      } catch (error) {
        message.error('Thao tác thất bại');
      }
    });
  };

  const columns = [
    {
      title: 'THÔNG TIN PHIM',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Movie) => (
        <div className="flex items-center gap-4 py-2">
          <img src={record.poster_url || "https://via.placeholder.com/100x150"} alt="poster" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
          <div>
            <div className="font-bold text-gray-800 text-base">{text}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span>{record.release_date ? new Date(record.release_date).getFullYear() : 'N/A'}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{record.director}</span>
            </div>
          </div>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Movie) => record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'THỂ LOẠI',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: string[]) => (
        <div className="flex flex-wrap gap-1">
          {genres?.map(tag => (
            <Tag key={tag} bordered={false} className="bg-gray-100 text-gray-600 rounded-md px-2 py-1 text-xs font-medium">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'LƯỢT XEM',
      dataIndex: 'rating_stats',
      key: 'views',
      sorter: (a: Movie, b: Movie) => (a.rating_stats?.count || 0) - (b.rating_stats?.count || 0),
      render: (stats: any) => <span className="font-semibold text-gray-700">{stats?.count?.toLocaleString() || 0}</span>,
    },
    {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const isLive = status === 'released' || status === 'now_showing';
          const isEnded = status === 'ended';
          return (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isLive ? 'bg-green-50 text-green-700' : isEnded ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-700'}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isLive ? 'bg-green-500' : isEnded ? 'bg-gray-400' : 'bg-orange-500'}`}></div>
                {status}
            </div>
          )
        },
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_: any, record: Movie) => (
        <Space>
          <Button type="text" shape="circle" icon={<Edit size={16} className="text-gray-500 hover:text-indigo-600" />} onClick={() => handleEdit(record)} />
          <Button type="text" shape="circle" icon={<Trash2 size={16} className="text-gray-500 hover:text-red-500" />} onClick={() => handleDelete(record._id)} />
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
          <Button 
            type="primary" 
            size="large" 
            icon={<Plus size={18} />} 
            onClick={() => { 
                setEditingMovie(null); 
                form.resetFields(); 
                form.setFieldsValue({ status: 'now_showing', year: new Date().getFullYear() });
                setIsModalOpen(true); 
            }} 
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl border-none"
          >
            Thêm Phim
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={movies} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 5 }} 
        className="custom-table" 
      />

      <Modal title={editingMovie ? "Cập nhật" : "Thêm mới"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={600}>
        <Form form={form} layout="vertical" initialValues={{ status: 'now_showing' }} className="mt-6">
          <Form.Item name="title" label="Tên phim" rules={[{ required: true }]}><Input size="large" className="rounded-lg" /></Form.Item>
          <Row gutter={16}>
             <Col span={12}><Form.Item name="director" label="Đạo diễn" rules={[{ required: true }]}><Input size="large" className="rounded-lg" /></Form.Item></Col>
             <Col span={12}><Form.Item name="year" label="Năm" rules={[{ required: true }]}><Input type="number" size="large" className="rounded-lg" /></Form.Item></Col>
          </Row>
          <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}><Select mode="tags" size="large"><Option value="Action">Action</Option><Option value="Drama">Drama</Option><Option value="Comedy">Comedy</Option></Select></Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select size="large">
                <Option value="now_showing">Now Showing</Option>
                <Option value="coming_soon">Coming Soon</Option>
                <Option value="released">Released</Option>
                <Option value="ended">Ended</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MoviesPage;
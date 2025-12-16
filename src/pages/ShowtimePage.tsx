import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Select, DatePicker, InputNumber, Tag, message, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

// Import Types & Slices
import type { Showtime, Movie } from '../interface/type'; 
import type { AppDispatch, RootState } from '../redux/store';
import { fetchShowtimes, createShowtime, deleteShowtime, type CreateShowtimeDTO } from '../redux/slices/showtimeSlice';
import { fetchMovies } from '../redux/slices/movieSlice'; 

const ShowtimePage= () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { list: showtimes, loading } = useSelector((state: RootState) => state.showtime);
  const { list: movies } = useSelector((state: RootState) => state.movie);

  useEffect(() => {
    dispatch(fetchShowtimes());
    dispatch(fetchMovies());
  }, [dispatch]);

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteShowtime(id)).unwrap();
      message.success('Đã xóa lịch chiếu!');
    } catch (error) {
      message.error('Xóa thất bại, có thể do lỗi server.');
    }
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns: ColumnsType<Showtime> = [
    {
      title: 'Thông tin phim',
      key: 'movie',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img 
            src={record.movie_poster} 
            alt="poster" 
            className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200"
          />
          <div>
            <h4 className="font-bold text-gray-800 m-0 text-sm">{record.movie_title}</h4>
            <span className="text-xs text-gray-400">ID: {record.movie_id.slice(-4)}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Phòng Chiếu',
      dataIndex: 'screen_name',
      key: 'screen_name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Lịch Chiếu',
      key: 'time',
      render: (_, record) => {
        // Kiểm tra xem lịch đã qua chưa để đổi màu
        const isEnded = dayjs(record.end_time).isBefore(dayjs());
        
        return (
          <div className="flex flex-col">
            <div className={`flex items-center gap-1 font-semibold ${isEnded ? 'text-gray-400' : 'text-blue-600'}`}>
              <CalendarOutlined />
              {dayjs(record.start_time).format('HH:mm')} - {dayjs(record.end_time).format('HH:mm')}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                {dayjs(record.start_time).format('DD/MM/YYYY')}
                </span>
                {isEnded && <Tag className="text-[10px] m-0" color="default">Đã qua</Tag>}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Giá Vé',
      dataIndex: 'base_price',
      key: 'base_price',
      render: (price) => (
        <span className="font-bold text-green-600">
          {price.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Ghế Đã Đặt',
      dataIndex: 'seats_booked',
      key: 'seats_booked',
      render: (seats: string[] | undefined) => {
        // FIX LỖI CRASH: Kiểm tra undefined/null
        const safeSeats = seats || [];
        
        return (
          safeSeats.length > 0 ? (
            <Tooltip title={safeSeats.join(', ')}>
              <Tag color="volcano" className="cursor-help">
                {safeSeats.length} ghế
              </Tag>
            </Tooltip>
          ) : (
            <Tag color="success">Trống</Tag>
          )
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Xóa lịch chiếu?"
          description="Bạn có chắc muốn xóa lịch này không?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa ngay"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            className="flex items-center justify-center"
          />
        </Popconfirm>
      ),
    },
  ];

  // --- XỬ LÝ FORM ---
  const onMovieChange = (movieId: string) => {
    const movie = movies.find((m: any) => m._id === movieId);
    if (movie) setSelectedMovie(movie as Movie);
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedMovie) {
        message.error('Vui lòng chọn phim trước!');
        return;
      }

      // Tự động tính giờ kết thúc
      const startTime = values.start_time; 
      const endTime = startTime.add(selectedMovie.duration_min, 'minute');

      const payload: CreateShowtimeDTO = {
        movie_id: selectedMovie._id,
        screen_name: values.screen_name,
        base_price: values.base_price,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        movie_title: selectedMovie.title,
        movie_poster: selectedMovie.poster_url,
      };

      await dispatch(createShowtime(payload)).unwrap();
      message.success('Tạo lịch chiếu thành công!');
      setIsModalOpen(false);
      form.resetFields();
      setSelectedMovie(null);
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra!');
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Quản Lý Lịch Chiếu</h1>
          <p className="text-gray-500 m-0 text-sm">Sắp xếp thời gian và phòng chiếu phim</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          className="bg-blue-600 hover:bg-blue-500 shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          Tạo Lịch Chiếu
        </Button>
      </div>

      {/* Table */}
      <Table 
        columns={columns} 
        // 1. Copy mảng để sort tránh lỗi mutate state
        // 2. Sort: Mới nhất (tương lai) lên đầu, cũ nhất (quá khứ) xuống dưới
        dataSource={[...showtimes].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())}
        rowKey="_id" 
        loading={loading}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        pagination={{ pageSize: 8 }}
        // Làm mờ hàng nếu lịch đã qua
        rowClassName={(record) => dayjs(record.end_time).isBefore(dayjs()) ? 'bg-gray-50 opacity-60 grayscale-[0.5]' : ''}
      />

      {/* Modal Form */}
      <Modal
        title={<span className="text-lg font-bold">Thêm Lịch Chiếu Mới</span>}
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        width={600}
        centered
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="movie_id"
            label="Chọn Phim"
            rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
          >
            <Select
              placeholder="Tìm kiếm phim..."
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={onMovieChange}
              options={movies.map((m: any) => ({ label: m.title, value: m._id }))}
            />
          </Form.Item>

          {selectedMovie && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100 flex gap-3">
               <img src={selectedMovie.poster_url} alt="" className="w-12 h-16 object-cover rounded"/>
               <div>
                  <div className="font-bold text-blue-800">{selectedMovie.title}</div>
                  <div className="text-xs text-gray-600">Thời lượng: <b>{selectedMovie.duration_min} phút</b></div>
                  <div className="text-xs text-gray-600">Ngày phát hành: {dayjs(selectedMovie.release_date).format('DD/MM/YYYY')}</div>
               </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="start_time"
              label="Ngày & Giờ Chiếu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <DatePicker 
                showTime={{ format: 'HH:mm' }} 
                format="DD/MM/YYYY HH:mm" 
                className="w-full"
                placeholder="Chọn giờ bắt đầu"
              />
            </Form.Item>

            <Form.Item
              name="screen_name"
              label="Phòng Chiếu"
              initialValue="Phòng 1"
              rules={[{ required: true, message: 'Nhập tên phòng' }]}
            >
              <Select options={[
                { value: 'Phòng 1', label: 'Phòng 1 (Standard)' },
                { value: 'Phòng 2', label: 'Phòng 2 (VIP)' },
                { value: 'Phòng 3', label: 'Phòng 3' },
                { value: 'Phòng IMAX', label: 'Phòng IMAX' },
              ]} />
            </Form.Item>
          </div>

          <Form.Item
            name="base_price"
            label="Giá vé cơ bản (VNĐ)"
            initialValue={75000}
            rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
          >
            <InputNumber<number>
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')as unknown as number}
              min={0}
              step={5000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowtimePage;
import React, { useState } from 'react';
import { Input, Button, Card, Tag, List, Spin } from 'antd';
import { ScanLine, Search, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
// Thư viện quét QR
import { Scanner } from '@yudiel/react-qr-scanner'; 

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkInTicket, clearResult } from '../redux/slices/checkinSlice';

const TicketCheckinPage: React.FC = () => {
  const dispatch = useAppDispatch();
  // Lấy state từ Redux CheckinSlice
  const { loading, result, error, history } = useAppSelector((state) => state.checkin);
  
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // Biến tạm dừng camera khi đang xử lý

  // --- XỬ LÝ QUÉT QR ---
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0 && !isPaused) {
      const rawCode = detectedCodes[0].rawValue;
      if (rawCode) {
        processTicket(rawCode);
      }
    }
  };

  // --- HÀM GỌI API CHECK-IN ---
  const processTicket = async (bookingId: string) => {
    setIsPaused(true); // 1. Tạm dừng camera ngay lập tức
    
    // 2. Phát âm thanh Beep
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(() => {});

    // 3. Gọi Action Redux
    await dispatch(checkInTicket(bookingId));
  };

  // Nút reset để quét người tiếp theo
  const handleReset = () => {
    setIsPaused(false);
    dispatch(clearResult());
  };

  // Xử lý nhập mã thủ công
  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    processTicket(manualCode.trim());
    setManualCode('');
  };

  // --- RENDER PHẦN KẾT QUẢ ---
  const renderResult = () => {
    if (loading) return <div className="text-center py-16"><Spin size="large" tip="Đang kiểm tra thông tin vé..." /></div>;
    
    // TRƯỜNG HỢP LỖI
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-bounce">
          <XCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">CHECK-IN THẤT BẠI</h2>
          <p className="text-gray-800 text-lg font-medium">{error}</p>
          
          <Button type="default" size="large" onClick={handleReset} className="mt-6 font-bold">
            Thử lại
          </Button>
        </div>
      );
    }

    // TRƯỜNG HỢP THÀNH CÔNG
    if (result) {
      // 🔥 FIX LỖI TYPE Ở ĐÂY: Ép kiểu sang any để TypeScript không báo lỗi .tickets
      const ticketData = result as any;

      // Xử lý hiển thị danh sách ghế (Hỗ trợ cả cấu trúc cũ seats[] và mới tickets[])
      let seatDisplay = "";
      
      if (Array.isArray(ticketData.tickets) && ticketData.tickets.length > 0) {
          // Trường hợp mới: tickets = [{seat_name: "A1"}, ...]
          seatDisplay = ticketData.tickets.map((t: any) => t.seat_name).join(', ');
      } else if (Array.isArray(ticketData.seats)) {
          // Trường hợp cũ: seats = ["A1", "A2"]
          seatDisplay = ticketData.seats.join(', ');
      }

      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-pulse-once">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">HỢP LỆ / THÀNH CÔNG</h2>
          <p className="text-gray-500">Đã xác thực thành công vé của bạn!Phan Khanh Xin Cảm ơn!!!</p>

          <div className="text-left mt-6 bg-white p-5 rounded-lg shadow-sm border border-green-100 space-y-3">
            <div className="flex justify-between border-b border-dashed pb-2">
                <span className="text-gray-500">Phim:</span>
                <span className="font-bold text-blue-700 text-right">{ticketData.movie_title || "Phim"}</span>
            </div>
            
            <div className="flex flex-col border-b border-dashed pb-2">
                <span className="text-gray-500 mb-1">Ghế đã chọn:</span>
                <span className="text-3xl font-black text-[#ce1212] tracking-widest">{seatDisplay}</span>
            </div>

            <div className="flex justify-between pt-2">
                <span className="text-gray-500 text-xs">Tổng tiền:</span>
                <span className="font-bold text-green-700">{ticketData.total_amount?.toLocaleString()} đ</span>
            </div>
            
            <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Mã đơn:</span>
                <span className="font-mono text-xs text-gray-400">{ticketData._id}</span>
            </div>
          </div>

          <Button type="primary" size="large" onClick={handleReset} className="mt-6 w-full h-12 text-lg font-bold shadow-lg shadow-blue-500/30">
            QUÉT ĐƠN TIẾP THEO
          </Button>
        </div>
      );
    }

    // TRẠNG THÁI CHỜ
    return (
      <div className="text-center py-20 text-gray-400 flex flex-col items-center">
        <ScanLine size={64} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">Sẵn sàng quét vé</p>
        <p className="text-sm">Vui lòng đưa mã QR trọn gói vào khung hình</p>
      </div>
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-w-7xl mx-auto">
        
        {/* --- CỘT TRÁI: CAMERA QUÉT --- */}
        <div className="flex flex-col gap-4">
          <Card 
            className="shadow-md flex-1 flex flex-col border-0" 
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700">
                <ScanLine className="text-blue-600"/> Máy Quét Vé (Admin)
            </h3>
            
            {/* KHUNG CAMERA */}
            <div className="bg-black rounded-2xl overflow-hidden relative flex-1 min-h-[300px] flex items-center justify-center shadow-inner">
              {isScanning ? (
                <div className="w-full h-full relative">
                  <Scanner 
                    onScan={handleScan}
                    paused={isPaused} 
                    components={{ audio: false, finder: true }} 
                    styles={{ container: { width: '100%', height: '100%' } }}
                  />
                  
                  {isPaused && (
                    <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      {loading ? <Spin size="large" /> : <CheckCircle size={48} className="text-green-500"/>}
                      <p className="mt-4 font-bold">{loading ? "Đang xử lý..." : "Đã quét xong"}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                    <ScanLine size={48} className="mb-2 opacity-50"/>
                    <span>Camera đang tắt</span>
                </div>
              )}
            </div>

            {/* NÚT ĐIỀU KHIỂN CAMERA */}
            <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded-lg">
               <span className="text-xs text-gray-500">
                   Trạng thái: <span className="font-bold">{isScanning ? (isPaused ? 'Tạm dừng' : 'Đang quét') : 'Đã tắt'}</span>
               </span>
               <Button 
                 onClick={() => { setIsScanning(!isScanning); setIsPaused(false); dispatch(clearResult()); }} 
                 icon={<RotateCcw size={16} />}
               >
                 {isScanning ? 'Tắt Camera' : 'Bật Camera'}
               </Button>
            </div>

            {/* NHẬP MÃ THỦ CÔNG */}
            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                <Input 
                    placeholder="Nhập mã ID đơn hàng..." 
                    value={manualCode} 
                    onChange={(e) => setManualCode(e.target.value)} 
                    onPressEnter={handleManualSubmit}
                    size="large"
                />
                <Button type="primary" size="large" onClick={handleManualSubmit} icon={<Search size={18} />}>
                    Check
                </Button>
            </div>
          </Card>
        </div>

        {/* --- CỘT PHẢI: KẾT QUẢ & LỊCH SỬ --- */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          
          {/* PHẦN HIỂN THỊ KẾT QUẢ CHECK-IN */}
          <Card className="shadow-md min-h-[400px] flex flex-col justify-center border-0 relative overflow-hidden">
             {renderResult()}
          </Card>

          {/* PHẦN LỊCH SỬ PHIÊN LÀM VIỆC */}
          <Card title="Lịch sử quét phiên này" className="shadow-sm flex-1 overflow-auto border-0" bodyStyle={{ padding: 0 }}>
            <div className="h-full overflow-y-auto max-h-[250px] bg-white">
              <List
                dataSource={history}
                renderItem={(item) => (
                  <List.Item className={`px-4 py-3 border-b hover:bg-gray-50 transition-colors`}>
                    <div className="flex justify-between w-full items-center">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-gray-700 text-xs">
                            {item.id.length > 10 ? item.id.slice(-8).toUpperCase() : item.id}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                      </div>
                      <Tag color={item.status === 'success' ? 'green' : 'red'}>
                        {item.status === 'success' ? 'OK' : 'FAIL'}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default TicketCheckinPage;
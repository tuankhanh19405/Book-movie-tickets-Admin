import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api-class-o1lo.onrender.com/api/khanhphuong/bookings'; 

export const checkInTicket = createAsyncThunk(
  'checkin/scan',
  async (bookingId: string, thunkAPI) => {
    try {
      // 1. LẤY BOOKING TỪ SERVER DỰA VÀO ID QUÉT ĐƯỢC
      // (Không cần split dấu '-' nữa vì QR chỉ chứa ID)
      const response = await axios.get(`${API_URL}/${bookingId}`);
      const booking = response.data.data || response.data;

      if (!booking) {
         return thunkAPI.rejectWithValue("Không tìm thấy đơn hàng!");
      }

      // 2. KIỂM TRA: Nếu đơn hàng đã được đánh dấu check-in toàn bộ rồi
      // (Hoặc bạn có thể check từng vé, nhưng ở đây mình check cờ tổng cho nhanh)
      if (booking.isCheckIn === true) {
          const time = booking.checkInAt ? new Date(booking.checkInAt).toLocaleString('vi-VN') : 'trước đó';
          return thunkAPI.rejectWithValue(`Đơn hàng này đã được check-in vào lúc ${time}!`);
      }

      // 3. CẬP NHẬT: Đánh dấu TẤT CẢ ghế là đã check-in
      const updatedTickets = booking.tickets.map((t: any) => ({
          ...t,
          isCheckIn: true,
          checkInAt: new Date().toISOString()
      }));

      // 4. GỬI API PUT
      const updateData = {
          ...booking,
          tickets: updatedTickets,
          isCheckIn: true, // Đánh dấu cả đơn là đã check-in
          checkInAt: new Date().toISOString()
      };

      await axios.put(`${API_URL}/${bookingId}`, updateData);

      // 5. TRẢ VỀ KẾT QUẢ
      return updateData;

    } catch (error: any) {
      if (error.response?.status === 404) return thunkAPI.rejectWithValue("Mã vé không tồn tại!");
      return thunkAPI.rejectWithValue("Lỗi hệ thống hoặc định dạng mã sai.");
    }
  }
);

// ... (Phần Slice giữ nguyên)
const initialState = { loading: false, result: null, error: null, history: [] as any[] };
const checkInSlice = createSlice({
    name: 'checkin',
    initialState,
    reducers: { clearResult: (state) => { state.result = null; state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(checkInTicket.pending, (state) => { state.loading = true; state.error = null; state.result = null; })
            .addCase(checkInTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.history.unshift({ id: action.meta.arg, time: new Date().toLocaleTimeString(), status: 'success', data: action.payload });
            })
            .addCase(checkInTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.history.unshift({ id: action.meta.arg, time: new Date().toLocaleTimeString(), status: 'error', msg: action.payload });
            });
    }
});
export const { clearResult } = checkInSlice.actions;
export default checkInSlice.reducer;
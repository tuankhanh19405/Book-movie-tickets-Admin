import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Cập nhật interface User thêm trường status
export interface User {
  _id: string;
  username: string; // Đã sửa từ name -> username như bài trước
  email: string;
  avatar?: string;
  role: string;
  status?: 'active' | 'banned'; // Thêm trường này
  phone?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// URL API
const API_URL = 'https://api-class-o1lo.onrender.com/api/khanhphuong/users';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data || response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔥 ĐỔI TỪ DELETE -> LOCK (TOGGLE STATUS)
export const toggleLockUser = createAsyncThunk(
    'users/toggleLockUser',
    async ({ id, currentStatus }: { id: string, currentStatus: string }, thunkAPI) => {
      try {
        // Logic: Nếu đang active thì ban, ngược lại thì active
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        
        // Gọi API PUT để cập nhật
        // Lưu ý: Đây là giả định endpoint update, bạn cần check lại API của bạn
        await axios.put(`${API_URL}/${id}`, { status: newStatus });
        
        return { id, status: newStatus };
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || 'Lỗi cập nhật trạng thái');
      }
    }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      // Xử lý cập nhật trạng thái trong store
      .addCase(toggleLockUser.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const user = state.users.find(u => u._id === id);
        if (user) {
            // Ép kiểu status cho đúng typescript
            user.status = status as 'active' | 'banned';
        }
      });
  },
});

export default userSlice.reducer;
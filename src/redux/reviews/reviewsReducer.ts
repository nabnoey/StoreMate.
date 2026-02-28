
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewsService } from '../../services/reviews.service';
import type { CreateReviewPayload } from '../../types/review'; 

export const submitProductReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ id, payload }: { id: number; payload: CreateReviewPayload }, { rejectWithValue }) => {
    try {
      const response = await ReviewsService.createReviews(id, payload);
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit review');
    }
  }
);

// สร้าง Slice (ไว้สำหรับจัดการ Loading/Error state ถ้าต้องการ)
const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitProductReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitProductReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;
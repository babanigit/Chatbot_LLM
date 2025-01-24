import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatbotState {
  messages: Message[];
  loading: boolean;
}

const initialState: ChatbotState = {
  messages: [],
  loading: false,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, setLoading } = chatbotSlice.actions;

export default chatbotSlice.reducer;

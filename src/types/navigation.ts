import type { NavigatorScreenParams } from "@react-navigation/native";

// 메인 탭 네비게이션의 파라미터 타입
export type MainTabParamList = {
  Calendar: undefined;
  Todo: undefined;
  Finance: undefined;
  Notes: undefined;
};

// 각 스택 네비게이션의 파라미터 타입
export type CalendarStackParamList = {
  CalendarHome: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
};

export type TodoStackParamList = {
  TodoHome: undefined;
  TaskDetail: { taskId: string };
  CreateTask: undefined;
};

export type FinanceStackParamList = {
  FinanceHome: undefined;
  TransactionDetail: { transactionId: string };
  CreateTransaction: undefined;
};

export type NotesStackParamList = {
  NotesHome: undefined;
  NoteDetail: { noteId: string };
  CreateNote: undefined;
};

// 루트 네비게이션의 파라미터 타입
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Settings: undefined;
  Profile: { userId: string };
};

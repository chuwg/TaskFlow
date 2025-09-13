# 가계부 모듈 개발 완료

## 개요
TaskFlow 앱에 완전한 가계부 모듈이 추가되었습니다. 수입/지출 기록, 카테고리 관리, 예산 관리, 리포트, 캘린더 연동 등 모든 핵심 기능이 구현되었습니다.

## 구현된 기능

### 1. 수입/지출 기록
- **TransactionForm**: 거래 추가/수정 폼
- **TransactionList**: 거래 목록 표시 및 관리
- **TransactionFilter**: 고급 필터링 기능

### 2. 카테고리 관리
- **CategoryManager**: 카테고리 생성, 수정, 삭제
- 기본 카테고리 제공 (급여, 보너스, 식비, 교통비, 쇼핑, 엔터테인먼트)
- 수입/지출/이체별 카테고리 분류
- 색상 및 아이콘 커스터마이징

### 3. 예산 관리
- **BudgetManager**: 예산 설정 및 관리
- 주간/월간/연간 예산 설정
- 실시간 예산 사용률 표시
- 예산 초과 알림 기능

### 4. 리포트 기능
- **FinanceReport**: 종합적인 가계부 리포트
- 월별/주간/연간 통계
- 카테고리별 지출 분석
- 예산 현황 모니터링
- 주요 지출 내역

### 5. 캘린더 연동
- **FinanceCalendarView**: 캘린더 기반 가계부 뷰
- **useFinanceCalendarIntegration**: 캘린더 연동 훅
- 거래를 캘린더 이벤트로 표시
- 일별/월별 통계 표시

### 6. 메인 화면
- **FinanceScreen**: 가계부 메인 화면
- 목록/캘린더 뷰 전환
- 빠른 작업 버튼
- 실시간 통계 표시

## 파일 구조

```
src/
├── contexts/
│   └── FinanceContext.tsx          # 가계부 상태 관리
├── components/finance/
│   ├── TransactionForm.tsx         # 거래 입력 폼
│   ├── TransactionList.tsx         # 거래 목록
│   ├── TransactionFilter.tsx       # 거래 필터
│   ├── CategoryManager.tsx         # 카테고리 관리
│   ├── BudgetManager.tsx           # 예산 관리
│   ├── FinanceReport.tsx           # 리포트
│   ├── FinanceCalendarView.tsx     # 캘린더 뷰
│   └── index.ts                    # 컴포넌트 export
├── hooks/
│   └── useFinanceCalendarIntegration.ts  # 캘린더 연동 훅
├── screens/
│   └── FinanceScreen.tsx           # 가계부 메인 화면
└── types/
    └── finance.ts                  # 가계부 타입 정의
```

## 사용법

### 1. 기본 설정
가계부 모듈은 이미 App.tsx에 통합되어 있습니다:

```tsx
import { FinanceProvider } from "./src/contexts/FinanceContext";

// Provider로 감싸기
<FinanceProvider>
  <AppContent />
</FinanceProvider>
```

### 2. 거래 추가
```tsx
import { useFinance } from '@/contexts/FinanceContext';

const { addTransaction } = useFinance();

await addTransaction({
  type: 'expense',
  amount: 5000,
  currency: 'KRW',
  category: 'expense-food',
  description: '점심 식사',
  date: new Date(),
  status: 'completed',
  paymentMethod: 'card',
  tags: ['외식'],
});
```

### 3. 거래 조회
```tsx
const { transactions, getTransactionsByDate } = useFinance();

// 특정 날짜의 거래
const dayTransactions = getTransactionsByDate(new Date());

// 필터링된 거래
const filteredTransactions = transactions.filter(t => 
  t.type === 'expense' && t.amount > 10000
);
```

### 4. 통계 조회
```tsx
const { stats } = useFinance();

console.log('월 수입:', stats.monthlyIncome);
console.log('월 지출:', stats.monthlyExpense);
console.log('월 순수익:', stats.monthlyNetIncome);
```

## 필요한 패키지 설치

차트 기능을 사용하려면 다음 패키지를 설치해야 합니다:

```bash
npm install react-native-chart-kit react-native-svg
# 또는
yarn add react-native-chart-kit react-native-svg
```

## 데이터 저장

모든 가계부 데이터는 AsyncStorage에 저장됩니다:
- `finance_transactions`: 거래 내역
- `finance_accounts`: 계좌 정보
- `finance_categories`: 카테고리 정보
- `finance_budgets`: 예산 정보
- `finance_goals`: 목표 정보

## 주요 특징

1. **완전한 타입 안전성**: TypeScript로 모든 타입이 정의됨
2. **반응형 디자인**: 다양한 화면 크기에 대응
3. **테마 지원**: 라이트/다크 테마 완전 지원
4. **오프라인 지원**: AsyncStorage를 통한 로컬 저장
5. **캘린더 연동**: 기존 캘린더 모듈과 완전 통합
6. **확장 가능**: 새로운 기능 추가가 용이한 구조

## 다음 단계

1. 차트 라이브러리 설치
2. 실제 데이터로 테스트
3. 필요에 따른 추가 기능 구현
4. 성능 최적화

가계부 모듈이 성공적으로 구현되었습니다! 🎉

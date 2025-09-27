// 従業員情報の型定義
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  employmentType: '正社員' | '契約社員' | 'パート' | 'アルバイト';
  hireDate: string;
  status: '在籍' | '退職';
}

// ユーザー権限の型定義
export type UserRole = 'admin' | 'employee';

// ユーザー情報の型定義
export interface User {
  role: UserRole;
  name: string;
}
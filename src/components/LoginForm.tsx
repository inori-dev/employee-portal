import React, { useState } from 'react';
import { User, UserRole } from '../types/Employee';
import { Users, LogIn } from 'lucide-react';

// ログインフォームコンポーネントのプロパティ型定義
interface LoginFormProps {
  onLogin: (user: User) => void;
}

/**
 * ログインフォームコンポーネント
 * デモ用の簡易ログイン機能を提供
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('employee');

  /**
   * ログインフォームの送信処理
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({ name: name.trim(), role });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* ログインフォームのヘッダー */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">従業員管理システム</h1>
          <p className="text-gray-600 mt-2">ログインしてシステムにアクセス</p>
        </div>

        {/* ログインフォーム */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 名前入力フィールド */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前を入力してください"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 権限選択フィールド */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              権限
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="employee">一般社員</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <LogIn className="h-5 w-5" />
            <span>ログイン</span>
          </button>
        </form>

        {/* デモ用の説明 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>デモ用システムです。</strong><br />
            • 一般社員：閲覧のみ可能<br />
            • 管理者：全ての操作が可能<br />
            お名前を入力して権限を選択してください。
          </p>
        </div>
      </div>
    </div>
  );
};
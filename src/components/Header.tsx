import React from 'react';
import { User, UserRole } from '../types/Employee';
import { Users, UserCheck, LogOut } from 'lucide-react';

// ヘッダーコンポーネントのプロパティ型定義
interface HeaderProps {
  user: User;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

/**
 * アプリケーションのヘッダーコンポーネント
 * ユーザー情報の表示、権限切替、ログアウト機能を提供
 */
export const Header: React.FC<HeaderProps> = ({ user, onRoleChange, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* アプリケーションタイトル */}
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">従業員管理システム</h1>
          </div>
          
          {/* ユーザー情報とコントロール */}
          <div className="flex items-center space-x-4">
            {/* 現在のユーザー情報表示 */}
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{user.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role === 'admin' ? '管理者' : '一般社員'}
              </span>
            </div>
            
            {/* 権限切替セレクトボックス */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">権限切替:</label>
              <select
                value={user.role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="employee">一般社員</option>
                <option value="admin">管理者</option>
              </select>
            </div>
            
            {/* ログアウトボタン */}
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="ログアウト"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
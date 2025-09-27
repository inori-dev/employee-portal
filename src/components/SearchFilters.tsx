import React from 'react';
import { Search, Filter } from 'lucide-react';

// 検索・フィルターコンポーネントのプロパティ型定義
interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (department: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

/**
 * 検索・フィルターコンポーネント
 * 従業員データの検索とフィルタリング機能を提供
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* フィルターセクションのヘッダー */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">検索・フィルター</h3>
      </div>
      
      {/* 検索・フィルター入力フィールド */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* キーワード検索フィールド */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="氏名、メール、電話番号で検索..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* 部署フィルター */}
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">全ての部署</option>
          <option value="営業部">営業部</option>
          <option value="開発部">開発部</option>
          <option value="総務部">総務部</option>
          <option value="マーケティング部">マーケティング部</option>
          <option value="人事部">人事部</option>
          <option value="経理部">経理部</option>
          <option value="企画部">企画部</option>
          <option value="品質管理部">品質管理部</option>
        </select>
        
        {/* ステータスフィルター */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">全てのステータス</option>
          <option value="在籍">在籍</option>
          <option value="退職">退職</option>
        </select>
      </div>
    </div>
  );
};
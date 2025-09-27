import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ページネーションコンポーネントのプロパティ型定義
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * ページネーションコンポーネント
 * データの分割表示とページ移動機能を提供
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  // 現在のページで表示されているアイテムの範囲を計算
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // ページが1ページ以下の場合は表示しない
  if (totalPages <= 1) return null;

  /**
   * 表示するページ番号の配列を生成する
   * @returns ページ番号の配列
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    // 総ページ数が表示可能数以下の場合は全て表示
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 現在のページを中心に表示範囲を計算
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);
      
      // 開始・終了ページの調整
      if (currentPage <= half) {
        end = maxVisible;
      } else if (currentPage >= totalPages - half) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
      {/* モバイル用のシンプルなページネーション */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </button>
      </div>
      
      {/* デスクトップ用の詳細なページネーション */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {/* 現在の表示範囲の情報 */}
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{startItem}</span>
            {' - '}
            <span className="font-medium">{endItem}</span>
            {' / '}
            <span className="font-medium">{totalItems}</span>
            {' 件'}
          </p>
        </div>
        
        {/* ページ番号ナビゲーション */}
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {/* 前のページボタン */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* ページ番号ボタン */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* 次のページボタン */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};
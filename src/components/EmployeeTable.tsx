import React from 'react';
import { Employee, UserRole } from '../types/Employee';
import { Edit, Trash2, Mail, Phone, ChevronUp, ChevronDown } from 'lucide-react';

// 従業員テーブルコンポーネントのプロパティ型定義
interface EmployeeTableProps {
  employees: Employee[];
  userRole: UserRole;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  sortField: keyof Employee | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Employee) => void;
}

/**
 * 従業員一覧テーブルコンポーネント
 * 従業員データの表示、並び替え、編集・削除機能を提供
 */
export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  userRole,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort
}) => {
  /**
   * ソートアイコンコンポーネント
   * 現在のソート状態に応じてアイコンを表示
   */
  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-gray-300" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  /**
   * 日付をyyyy/MM/dd形式でフォーマットする
   * @param dateString 日付文字列
   * @returns フォーマットされた日付文字列
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // 日付文字列をDateオブジェクトに変換
    const date = new Date(dateString);
    
    // 無効な日付の場合は元の文字列を返す
    if (isNaN(date.getTime())) return dateString;
    
    // yyyy/MM/dd形式でフォーマット
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  };

  // 従業員データが存在しない場合の表示
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">該当する従業員が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* テーブルヘッダー */}
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'name', label: '氏名' },
                { key: 'department', label: '所属' },
                { key: 'position', label: '役職' },
                { key: 'email', label: 'メール' },
                { key: 'phone', label: '電話番号' },
                { key: 'employmentType', label: '雇用形態' },
                { key: 'hireDate', label: '入社日' },
                { key: 'status', label: 'ステータス' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort(key as keyof Employee)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <SortIcon field={key as keyof Employee} />
                  </div>
                </th>
              ))}
              {/* 管理者の場合のみ操作列を表示 */}
              {userRole === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          {/* テーブルボディ */}
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                {/* 氏名 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                </td>
                {/* 所属 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </td>
                {/* 役職 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                {/* メールアドレス（クリック可能） */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${employee.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {employee.email}
                    </a>
                  </div>
                </td>
                {/* 電話番号 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{employee.phone}</span>
                  </div>
                </td>
                {/* 雇用形態（バッジ表示） */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.employmentType === '正社員' ? 'bg-blue-100 text-blue-800' :
                    employee.employmentType === '契約社員' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.employmentType}
                  </span>
                </td>
                {/* 入社日（フォーマット済み） */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(employee.hireDate)}
                </td>
                {/* ステータス（バッジ表示） */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === '在籍' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                {/* 操作ボタン（管理者のみ） */}
                {userRole === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* 編集ボタン */}
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* 削除ボタン */}
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
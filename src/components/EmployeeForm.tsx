import React, { useState, useEffect } from 'react';
import { Employee } from '../types/Employee';
import { X, Save, User } from 'lucide-react';

// 従業員フォームコンポーネントのプロパティ型定義
interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

/**
 * 従業員情報の追加・編集フォームコンポーネント
 * モーダル形式で従業員データの入力・編集機能を提供
 */
export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSave,
  onCancel,
  isOpen
}) => {
  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    employmentType: '正社員' as Employee['employmentType'],
    hireDate: '',
    status: '在籍' as Employee['status']
  });

  // 編集対象の従業員データまたはフォーム開閉状態が変更された時の処理
  useEffect(() => {
    if (employee) {
      // 編集モード：既存データをフォームに設定
      setFormData({
        name: employee.name,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        employmentType: employee.employmentType,
        hireDate: employee.hireDate,
        status: employee.status
      });
    } else {
      // 新規追加モード：フォームを初期化
      setFormData({
        name: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        employmentType: '正社員',
        hireDate: '',
        status: '在籍'
      });
    }
  }, [employee, isOpen]);

  /**
   * フォーム送信処理
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  /**
   * 入力フィールドの変更処理
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null;

  return (
    <>
      {/* モーダルオーバーレイ */}
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {employee ? '従業員情報編集' : '新規従業員登録'}
            </h2>
          </div>
          {/* 閉じるボタン */}
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* フォーム本体 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 氏名入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 所属入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属 <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所属を選択してください</option>
                <option value="営業部">営業部</option>
                <option value="開発部">開発部</option>
                <option value="総務部">総務部</option>
                <option value="マーケティング部">マーケティング部</option>
                <option value="人事部">人事部</option>
                <option value="経理部">経理部</option>
                <option value="企画部">企画部</option>
                <option value="品質管理部">品質管理部</option>
              </select>
            </div>

            {/* 役職入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職 <span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">役職を選択してください</option>
                <option value="部長">部長</option>
                <option value="課長">課長</option>
                <option value="主任">主任</option>
                <option value="係長">係長</option>
                <option value="チームリーダー">チームリーダー</option>
                <option value="マネージャー">マネージャー</option>
                <option value="エンジニア">エンジニア</option>
                <option value="スペシャリスト">スペシャリスト</option>
                <option value="アシスタント">アシスタント</option>
                <option value="一般社員">一般社員</option>
              </select>
            </div>

            {/* メールアドレス入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 電話番号入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 雇用形態選択フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                雇用形態 <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="正社員">正社員</option>
                <option value="契約社員">契約社員</option>
                <option value="パート">パート</option>
                <option value="アルバイト">アルバイト</option>
              </select>
            </div>

            {/* 入社日入力フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                入社日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* ステータス選択フィールド */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="在籍">在籍</option>
                <option value="退職">退職</option>
              </select>
            </div>
          </div>

          {/* フォームボタン */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            {/* キャンセルボタン */}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              キャンセル
            </button>
            {/* 保存ボタン */}
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>保存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};
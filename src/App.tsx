import React, { useState, useMemo } from 'react';
import { Employee, User, UserRole } from './types/Employee';
import { useEmployees } from './hooks/useEmployees';
import { exportToCSV, importFromCSV } from './utils/csvUtils';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeForm } from './components/EmployeeForm';
import { Pagination } from './components/Pagination';
import { Plus, Download, Upload, Users } from 'lucide-react';

/**
 * メインアプリケーションコンポーネント
 * 従業員管理システムの全体的な状態管理と画面制御を行う
 */
function App() {
  // ユーザー認証状態
  const [user, setUser] = useState<User | null>(null);
  
  // 検索・フィルター関連の状態
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // ソート関連の状態
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // ページネーション関連の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // フォーム関連の状態
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // 従業員データ管理のカスタムフック
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees
  } = useEmployees();

  // フィルタリングとソートを適用した従業員リストを計算
  // フィルタリングとソート
  const filteredAndSortedEmployees = useMemo(() => {
    // 検索・フィルター条件に基づいてデータを絞り込み
    let filtered = employees.filter(employee => {
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm);
      
      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || employee.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // ソート処理
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

  // ページネーション用の計算
  // ページネーション
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const currentEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /**
   * ログイン処理
   * @param userData ログインユーザーの情報
   */
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  /**
   * ログアウト処理
   * 全ての状態をリセットする
   */
  const handleLogout = () => {
    setUser(null);
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setCurrentPage(1);
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  /**
   * ユーザー権限変更処理
   * @param role 新しい権限
   */
  const handleRoleChange = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  /**
   * ソート処理
   * @param field ソート対象のフィールド
   */
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      // 同じフィールドの場合は昇順・降順を切り替え
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるフィールドの場合は昇順でソート開始
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  /**
   * 従業員編集処理
   * @param employee 編集対象の従業員データ
   */
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  /**
   * 従業員削除処理
   * @param id 削除対象の従業員ID
   */
  const handleDelete = (id: string) => {
    if (confirm('この従業員を削除してもよろしいですか？')) {
      deleteEmployee(id);
    }
  };

  /**
   * フォーム保存処理
   * @param employeeData 保存する従業員データ
   */
  const handleFormSave = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      // 編集モード：既存データを更新
      updateEmployee(editingEmployee.id, employeeData);
    } else {
      // 新規追加モード：新しいデータを追加
      addEmployee(employeeData);
    }
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  /**
   * フォームキャンセル処理
   */
  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  /**
   * CSVエクスポート処理
   */
  const handleExport = () => {
    exportToCSV(filteredAndSortedEmployees);
  };

  /**
   * CSVインポート処理
   */
  const handleImport = async () => {
    try {
      const importedEmployees = await importFromCSV();
      importEmployees(importedEmployees);
      alert(`${importedEmployees.length}件の従業員データをインポートしました。`);
    } catch (error) {
      alert('CSVファイルのインポートに失敗しました。');
    }
  };

  // ログインしていない場合はログインフォームを表示
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header user={user} onRoleChange={handleRoleChange} onLogout={handleLogout} />
      
      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページタイトルとアクションボタン */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">従業員一覧</h1>
              <p className="text-gray-600 mt-1">
                全{filteredAndSortedEmployees.length}名の従業員情報
              </p>
            </div>
          </div>
          
          {/* アクションボタン群 */}
          <div className="flex space-x-3">
            {/* CSVエクスポートボタン */}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>CSVエクスポート</span>
            </button>
            
            {/* 管理者のみ表示されるボタン */}
            {user.role === 'admin' && (
              <>
                {/* CSVインポートボタン */}
                <button
                  onClick={handleImport}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>CSVインポート</span>
                </button>
                
                {/* 新規登録ボタン */}
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>新規登録</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 検索・フィルターコンポーネント */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* 従業員テーブル */}
        <EmployeeTable
          employees={currentEmployees}
          userRole={user.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* ページネーション */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedEmployees.length}
          itemsPerPage={itemsPerPage}
        />

        {/* 従業員フォーム（モーダル） */}
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
          isOpen={isFormOpen}
        />
      </main>
    </div>
  );
}

export default App;
import { Employee } from '../types/Employee';

/**
 * 従業員データをCSVファイルとしてエクスポートする
 * @param employees エクスポートする従業員データの配列
 */
export const exportToCSV = (employees: Employee[]): void => {
  // CSVのヘッダー行を定義
  const headers = ['ID', '氏名', '所属', '役職', 'メール', '電話番号', '雇用形態', '入社日', 'ステータス'];
  
  // ヘッダーとデータ行を結合してCSV形式の文字列を作成
  const csvContent = [
    headers.join(','),
    ...employees.map(emp => [
      emp.id,
      `"${emp.name}"`,
      `"${emp.department}"`,
      `"${emp.position}"`,
      emp.email,
      emp.phone,
      emp.employmentType,
      emp.hireDate,
      emp.status
    ].join(','))
  ].join('\n');

  // BOMを付けてUTF-8でエンコードしたBlobを作成
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // ダウンロード用のリンクを作成してクリック
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * CSV文字列を解析して従業員データの配列に変換する
 * @param csvContent CSV形式の文字列
 * @returns 従業員データの配列
 */
export const parseCSV = (csvContent: string): Employee[] => {
  // 空行を除去して行に分割
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const employees: Employee[] = [];

  // ヘッダー行を除く各行を処理
  for (let i = 1; i < lines.length; i++) {
    // カンマで分割し、ダブルクォートを除去
    const values = lines[i].split(',').map(value => value.replace(/^"|"$/g, '').trim());
    
    // 必要な列数があることを確認
    if (values.length >= 9) {
      employees.push({
        id: values[0] || `emp_${Date.now()}_${i}`,
        name: values[1] || '',
        department: values[2] || '',
        position: values[3] || '',
        email: values[4] || '',
        phone: values[5] || '',
        employmentType: (values[6] as Employee['employmentType']) || '正社員',
        hireDate: values[7] || '',
        status: (values[8] as Employee['status']) || '在籍'
      });
    }
  }

  return employees;
};

/**
 * ファイル選択ダイアログを表示してCSVファイルをインポートする
 * @returns Promise<Employee[]> インポートされた従業員データの配列
 */
export const importFromCSV = (): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    // ファイル選択用のinput要素を作成
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('ファイルが選択されていません'));
        return;
      }

      // FileReaderを使用してファイルを読み込み
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const employees = parseCSV(csvContent);
          resolve(employees);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsText(file, 'UTF-8');
    };
    // ファイル選択ダイアログを表示
    input.click();
  });
};
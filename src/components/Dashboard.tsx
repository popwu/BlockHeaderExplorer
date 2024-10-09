import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  token: string;
  apiBaseUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token, apiBaseUrl }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">API数据仪表板</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">选择要查看的数据类型</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Header数据</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link to="/header" className="text-indigo-600 hover:text-indigo-900">查看Header数据</Link>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Peer数据</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link to="/peer" className="text-indigo-600 hover:text-indigo-900">查看Peer数据</Link>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Webhooks管理</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link to="/webhooks" className="text-indigo-600 hover:text-indigo-900">管理Webhooks</Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Dashboard;
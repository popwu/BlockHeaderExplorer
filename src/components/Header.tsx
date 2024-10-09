import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface HeaderProps {
  token: string;
  apiBaseUrl: string;
}

interface TipState {
  header: {
    hash: string;
    creationTimestamp: number;
  };
  height: number;
}

interface HeaderData {
  hash: string;
  creationTimestamp: number;
}

interface HeaderDetail {
  hash: string;
  version: number;
  prevBlockHash: string;
  merkleRoot: string;
  creationTimestamp: number;
  difficultyTarget: number;
  nonce: number;
  work: string;
}

const Header: React.FC<HeaderProps> = ({ token, apiBaseUrl }) => {
  const [tipState, setTipState] = useState<TipState | null>(null);
  const [headers, setHeaders] = useState<HeaderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHeader, setSelectedHeader] = useState<HeaderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    console.log('Fetching tip state...');
    fetchTipState();
  }, []);

  useEffect(() => {
    if (tipState) {
      console.log('Fetching headers...');
      fetchHeaders(tipState.height, currentPage);
    }
  }, [tipState, currentPage]);

  const fetchTipState = async () => {
    try {
      setLoading(true);
      console.log('Making API call to:', `${apiBaseUrl}/chain/tip/longest`);
      const response = await axios.get(`${apiBaseUrl}/chain/tip/longest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Tip state response:', response.data);
      setTipState(response.data);
    } catch (error) {
      console.error('Error fetching tip state:', error);
      setError(`获取最新区块数据失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeaders = async (height: number, page: number) => {
    try {
      setLoading(true);
      const startHeight = height - (page) * 10 + 1;
      console.log('Making API call to:', `${apiBaseUrl}/chain/header/byHeight?height=${startHeight}&count=10`);
      const response = await axios.get(`${apiBaseUrl}/chain/header/byHeight`, {
        params: { height: startHeight, count: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Headers response:', response.data);
      setHeaders(response.data);
    } catch (error) {
      console.error('Error fetching headers:', error);
      setError(`获取区块头数据失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeaderDetail = async (hash: string) => {
    try {
      setLoading(true);
      console.log('Making API call to:', `${apiBaseUrl}/chain/header/${hash}`);
      const response = await axios.get(`${apiBaseUrl}/chain/header/${hash}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Header detail response:', response.data);
      setSelectedHeader(response.data);
    } catch (error) {
      console.error('Error fetching header detail:', error);
      setError(`获取区块头详情失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">区块链数据</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">最新区块和区块头列表</p>
      </div>
      {tipState && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">最新区块高度</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tipState.height}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">最新区块哈希</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tipState.header.hash}</dd>
            </div>
          </dl>
        </div>
      )}
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">区块头列表</h4>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {headers.map((header, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => fetchHeaderDetail(header.hash)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 truncate"
                >
                  {header.hash}
                </button>
                <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  高度: {tipState ? tipState.height - (currentPage - 1) * 10 - index : ''}
                </p>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    时间: {new Date(header.creationTimestamp * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span>第 {currentPage} 页</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          下一页
        </button>
      </div>
      {selectedHeader && (
        <div className="mt-8 px-4 py-5 sm:px-6">
          <h4 className="text-lg leading-6 font-medium text-gray-900">区块头详情</h4>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">哈希</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.hash}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">版本</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.version}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">前一个区块哈希</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.prevBlockHash}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Merkle Root</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.merkleRoot}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">创建时间</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedHeader.creationTimestamp * 1000).toLocaleString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">难度目标</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.difficultyTarget}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nonce</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.nonce}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">工作量</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedHeader.work}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default Header;
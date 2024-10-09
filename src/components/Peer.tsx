import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface PeerProps {
  token: string;
  apiBaseUrl: string;
}

interface PeerData {
  ip: string;
  port: number;
}

const Peer: React.FC<PeerProps> = ({ token, apiBaseUrl }) => {
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    console.log('Fetching peers...');
    fetchPeers();
  }, []);

  const fetchPeers = async () => {
    try {
      setLoading(true);
      console.log('Making API call to:', `${apiBaseUrl}/network/peer`);
      const response = await axios.get(`${apiBaseUrl}/network/peer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API response:', response.data);
      setPeers(response.data);
    } catch (error) {
      console.error('Error fetching peers:', error);
      setError(`获取 Peer 数据失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  console.log('Rendering peers:', peers);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Peer 数据</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">当前连接的 Peer 列表</p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {peers.map((peer, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">{peer.ip}</p>
                <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  端口: {peer.port}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-500">总计: {peers.length} 个 Peer</p>
      </div>
    </div>
  );
};

export default Peer;
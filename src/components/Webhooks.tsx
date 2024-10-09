import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WebhooksProps {
  token: string;
  apiBaseUrl: string;
}

interface Webhook {
  url: string;
  active: boolean;
  createdAt: string;
  errorsCount: number;
  lastEmitStatus: string;
  lastEmitTimestamp: string;
}

const Webhooks: React.FC<WebhooksProps> = ({ token, apiBaseUrl }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/webhook`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebhooks(response.data);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    }
  };

  const addWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/webhook`, { url: newWebhookUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewWebhookUrl('');
      fetchWebhooks();
    } catch (error) {
      console.error('Error adding webhook:', error);
    }
  };

  const deleteWebhook = async (url: string) => {
    try {
      await axios.delete(`${apiBaseUrl}/webhook`, {
        params: { url },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  };

  // Rest of the component remains the same
  // ...
};

export default Webhooks;
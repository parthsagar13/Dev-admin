import { useState } from 'react';
import toast from 'react-hot-toast';
import { downloadApi } from '@/services/api';
import { useUserAuth } from '@/context/UserAuthContext';

export const useTemplateDownload = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { isAuthenticated } = useUserAuth();

  const download = async (id: string, slug: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to download');
      return false;
    }

    try {
      setDownloadingId(id);
      const { downloadUrl } = await downloadApi.getSignedUrl(id);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${slug}.zip`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Download failed');
      return false;
    } finally {
      setDownloadingId(null);
    }
  };

  return { download, downloadingId, isDownloading: (id: string) => downloadingId === id };
};

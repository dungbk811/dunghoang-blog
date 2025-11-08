import toast from 'react-hot-toast';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ApiResponse {
  requiresRebuild?: boolean;
  [key: string]: any;
}

/**
 * Handle API response with automatic deployment notification
 *
 * @param response - Fetch response object
 * @param loadingToastId - Toast ID from toast.loading()
 * @param successMessage - Message to show on success (local mode)
 * @param router - Next.js router instance (optional, for auto-refresh on local)
 * @param onSuccess - Callback to run on success (optional)
 */
export async function handleApiResponse(
  response: Response,
  loadingToastId: string,
  successMessage: string,
  router?: AppRouterInstance,
  onSuccess?: () => void
): Promise<ApiResponse> {
  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data: ApiResponse = await response.json();

  if (data.requiresRebuild) {
    // Production mode - show deployment message
    toast.success(
      'Updated! Changes will be live after deployment (~2-3 minutes)',
      { id: loadingToastId, duration: 5000 }
    );
  } else {
    // Local mode - show success and refresh
    toast.success(successMessage, { id: loadingToastId });
    if (router) {
      router.refresh();
    }
  }

  if (onSuccess) {
    onSuccess();
  }

  return data;
}

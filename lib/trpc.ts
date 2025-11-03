import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers() {
        return {
          'content-type': 'application/json',
        };
      },
      fetch(url, options) {
        console.log('🌐 tRPC Request:', url);
        console.log('📦 Request options:', JSON.stringify({
          method: options?.method,
          headers: options?.headers,
        }, null, 2));
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        })
          .then((response) => {
            clearTimeout(timeoutId);
            console.log('📡 Response status:', response.status);
            console.log('📋 Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
            
            return response.clone().text().then(text => {
              console.log('📄 Response body preview:', text.substring(0, 500));
              
              if (!response.ok) {
                console.error('❌ Response not OK:', response.status, response.statusText);
                console.error('❌ Response body:', text);
              }
              
              return response;
            });
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            console.error('❌ Fetch error:', error);
            console.error('❌ Error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack,
            });
            throw error;
          });
      },
    }),
  ],
});

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
      async fetch(url, options) {
        console.log('🌐 tRPC Request:', url);
        console.log('📦 Request options:', JSON.stringify({
          method: options?.method,
          headers: options?.headers,
        }, null, 2));
        
        try {
          const response = await fetch(url, options);
          console.log('📡 Response status:', response.status);
          console.log('📋 Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
          
          const clonedResponse = response.clone();
          const text = await clonedResponse.text();
          console.log('📄 Response body preview:', text.substring(0, 500));
          
          if (!response.ok) {
            console.error('❌ Response not OK:', response.status, response.statusText);
          }
          
          return response;
        } catch (error) {
          console.error('❌ Fetch error:', error);
          throw error;
        }
      },
    }),
  ],
});

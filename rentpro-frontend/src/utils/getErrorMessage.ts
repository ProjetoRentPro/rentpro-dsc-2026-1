import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api-error';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const message = data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message ?? 'Erro inesperado';
  }

  return 'Erro inesperado';
}

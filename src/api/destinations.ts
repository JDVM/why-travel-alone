import { api } from './client';
import { Destination } from '../types';

export async function getDestinations(): Promise<Destination[]> {
    const { data } = await api.get<Destination[]>('/destinations');
    return data;
}

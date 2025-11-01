import PocketBase from 'pocketbase';
import { getPocketBaseUrl } from '@/lib/utils/getPocketBaseUrl';

export const pb = new PocketBase(getPocketBaseUrl());

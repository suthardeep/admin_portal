import { LoginPayload, LoginResponse } from '../types/login'
import { login, getProfile } from './queryFunctions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { User } from '@/types/user'


export const useLoginMutation = () => {
    return useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: (data: LoginPayload) => login(data)
    })
}

export const useProfileQuery = (enabled: boolean = true) => {
    return useQuery<{ data: User }, Error>({
        queryKey: ['profile'],
        queryFn: getProfile,
        enabled,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
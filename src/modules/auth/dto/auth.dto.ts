import { z } from 'zod';

export const RegisterUserSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

export const LoginUserSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(1).max(100).optional(),
});

export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

export type UserResponse = {
  username: string;
  name: string;
  token?: string;
};

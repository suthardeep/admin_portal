import { z } from 'zod';

export const tierSchema = z.object({
  name: z.string().min(1, 'Tier name is required'),
  platformCharges: z.number().min(0, 'Platform charges must be 0 or greater'),
  platformChargesType: z.enum(['PERCENTAGE', 'FIXED'], {
    error: 'Platform charges type is required',
  }),
  closingFee: z.number().min(0, 'Closing fee must be 0 or greater'),
  closingFeeType: z.enum(['PERCENTAGE', 'FIXED'], {
    error: 'Closing fee type is required',
  }),
  referralFee: z.number().min(0, 'Referral fee must be 0 or greater'),
  referralFeeType: z.enum(['PERCENTAGE', 'FIXED'], {
    error: 'Referral fee type is required',
  }),
  aavakCoins: z.number().min(0, 'Aavak coins must be 0 or greater'),
});

export type TierFormData = z.infer<typeof tierSchema>;

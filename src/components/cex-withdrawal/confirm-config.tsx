'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the form schema with validation
const formSchema = z.object({
  token: z.string().min(1, 'Token selection is required'),
  withdrawAmount: z.string().min(1, 'Withdraw amount is required'),
  timeStart: z.string().min(1, 'Start time is required'),
  timeEnd: z.string().min(1, 'End time is required'),
  minAmount: z.string().min(1, 'Minimum amount is required'),
  maxAmount: z.string().min(1, 'Maximum amount is required'),
  minOrderPerMinute: z.string().min(1, 'Minimum order per minute is required'),
  maxOrderPerMinute: z.string().min(1, 'Maximum order per minute is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function WithdrawalForm() {
  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
      withdrawAmount: '',
      timeStart: '',
      timeEnd: '',
      minAmount: '',
      maxAmount: '',
      minOrderPerMinute: '',
      maxOrderPerMinute: '',
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log('Withdrawal configuration:', data);
    // Here you would typically send the data to your API
  };

  return (
    <div className="max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Token Selection
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-800 bg-black text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray-800 bg-black text-white">
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="sol">Solana (SOL)</SelectItem>
                    <SelectItem value="usdt">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel className="text-sm text-gray-300">
                Token Balance
              </FormLabel>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value="0.00"
                  className="w-full border-gray-800 bg-black pr-8 text-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                    <span className="text-xs text-black">₿</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <FormLabel className="text-sm text-gray-300">
                Solana Balance
              </FormLabel>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value="0.00"
                  className="w-full border-gray-800 bg-black pr-8 text-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                    <span className="text-xs text-black">S</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="withdrawAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Withdraw Amount
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="w-full border-gray-800 bg-black text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="timeStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Time start
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="DD/MM/YYYY - HH:MM:SS"
                        className="w-full border-gray-800 bg-black pr-8 text-white"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={16} />
                    </div>
                  </div>
                  <FormMessage className="mt-1 text-xs text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <ArrowRight size={16} className="mx-2 mb-3 text-gray-400" />
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="timeEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-300">
                        Time end
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="DD/MM/YYYY - HH:MM:SS"
                            className="w-full border-gray-800 bg-black pr-8 text-white"
                            {...field}
                          />
                        </FormControl>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Calendar size={16} />
                        </div>
                      </div>
                      <FormMessage className="mt-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Amount per transaction
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Min"
                        className="w-full border-gray-800 bg-black pr-8 text-white"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                        <span className="text-xs text-black">₿</span>
                      </div>
                    </div>
                  </div>
                  <FormMessage className="mt-1 text-xs text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <ArrowRight size={16} className="mx-2 mb-3 text-gray-400" />
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="maxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-300">
                        Time end
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Max"
                            className="w-full border-gray-800 bg-black pr-8 text-white"
                            {...field}
                          />
                        </FormControl>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                            <span className="text-xs text-black">₿</span>
                          </div>
                        </div>
                      </div>
                      <FormMessage className="mt-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minOrderPerMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">
                    Random order per minute
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Min"
                      className="w-full border-gray-800 bg-black text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <ArrowRight size={16} className="mx-2 mb-3 text-gray-400" />
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="maxOrderPerMinute"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Max"
                          className="w-full border-gray-800 bg-black text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Later
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

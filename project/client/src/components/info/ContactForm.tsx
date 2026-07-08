import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Please add a subject'),
  message: z.string().min(20, 'Please write a detailed message (at least 20 characters)'),
});

type FormData = z.infer<typeof schema>;

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const to = 'support@codemarket.com';
      const subject = encodeURIComponent(`[CodeMarket] ${data.subject}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}\n\n— Sent from CodeMarket Contact Page`
      );

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      toast.success('Opening your email client…');
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Send us a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your full name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Billing, downloads, licensing, or support" {...register('subject')} />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us what you’re building, the template name (if applicable), and what you need help with."
              {...register('message')}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-gray-900 text-base hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Expected response time: within 24–48 business hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};


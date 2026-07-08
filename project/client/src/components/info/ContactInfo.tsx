import { Mail, MapPin, Clock, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ContactInfo = () => (
  <div className="space-y-4">
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <CardTitle className="text-base">Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-gray-600">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Support</p>
            <a className="text-blue-600 hover:underline" href="mailto:support@codemarket.com">
              support@codemarket.com
            </a>
            <p className="mt-2 font-medium text-gray-900">Sales</p>
            <a className="text-blue-600 hover:underline" href="mailto:sales@codemarket.com">
              sales@codemarket.com
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Business Hours</p>
            <p>Monday to Saturday</p>
            <p>10:00 AM to 7:00 PM IST</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p>India</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Social</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-3">
          <a className="rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50" href="#" aria-label="Twitter">
            Twitter / X
          </a>
          <a className="rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50" href="#" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a className="rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50" href="#" aria-label="YouTube">
            YouTube
          </a>
          <a className="rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50" href="#" aria-label="Instagram">
            Instagram
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          You can replace these links with your official profiles anytime.
        </p>
      </CardContent>
    </Card>

    <Card className="border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Google Maps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
          Map placeholder (embed your Google Maps iframe here)
        </div>
      </CardContent>
    </Card>
  </div>
);


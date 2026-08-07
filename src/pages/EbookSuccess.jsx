import React from 'react';
import { CheckCircle, Download, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../utils';
import { Link } from 'react-router-dom';

export default function EbookSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white border-2 border-[#7a1f30]/40 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#7a1f30'}}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Purchase Successful!
          </h1>
          
          <p className="text-slate-700 text-lg mb-6">
            Thank you for purchasing <span className="font-bold" style={{color: '#7a1f30'}}>Prophet Gad — The Watchman</span>
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-xl mb-3" style={{color: '#7a1f30'}}>📧 Check Your Email</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your e-book download link has been sent to your email address.
              Please check your inbox (and spam folder) for the delivery email.
            </p>
          </div>

          <div className="bg-[#7a1f30]/5 border border-[#7a1f30]/30 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-base mb-2" style={{color: '#7a1f30'}}>What's Inside:</h3>
            <ul className="text-slate-700 text-sm text-left space-y-2">
              <li>• The Prophetic Lineage — From David's Seer to Today</li>
              <li>• The Watchman's Assignment — Calling and Commission</li>
              <li>• Earth's Final Warning — The Three Angels' Messages</li>
              <li>• The Journey Through Exile — Formation and Return</li>
              <li>• Spiritual Warfare in the End Times</li>
              <li>• The Writing on the Wall — Reading the Signs</li>
            </ul>
          </div>

          <Link to={createPageUrl('MusicLibrary')}>
            <Button className="bg-[#7a1f30] hover:bg-[#6a1828] text-white font-bold px-8 py-3 rounded-lg">
              <Home className="w-5 h-5 mr-2" />
              Return to Music Library
            </Button>
          </Link>
        </div>

        <p className="text-slate-500 text-xs text-center mt-6">
          Need help? Contact Prophet Gad support.
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Mail, MessageCircle, BookOpen, X } from 'lucide-react';
import Link from 'next/link';

interface ContactSupportButtonProps {
  variant?: 'default' | 'compact';
}

export function ContactSupportButton({ variant = 'default' }: ContactSupportButtonProps) {
  const [open, setOpen] = useState(false);

  const contactOptions = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24-48 hours',
      action: 'mailto:taxmateapp@outlook.com',
      actionText: 'Send Email',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      icon: BookOpen,
      title: 'FAQ & Documentation',
      description: 'Find answers to common questions',
      action: '#faq',
      actionText: 'View FAQ',
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
    {
      icon: MessageCircle,
      title: 'App Store Reviews',
      description: 'Share feedback or read what others say',
      action: 'https://apps.apple.com/gb/app/taxmate-home-office-tax/id6757307991',
      actionText: 'View App Store',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      external: true,
    },
  ];

  if (variant === 'compact') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-[#005424] text-white hover:bg-[#004020] hover:text-white shadow-lg"
            aria-label="Get Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#005424]" />
              Get Help & Support
            </DialogTitle>
            <DialogDescription className="text-base">
              Choose how you'd like to get in touch or find answers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              const isExternal = option.external;
              const isHash = option.action.startsWith('#');

              const handleClick = () => {
                if (isHash) {
                  setOpen(false);
                  // Small delay to ensure dialog closes before scrolling
                  setTimeout(() => {
                    const element = document.querySelector(option.action);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              };

              const content = (
                <div
                  className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-[#005424] transition-all cursor-pointer group"
                  onClick={handleClick}
                >
                  <div className={`p-3 rounded-lg ${option.color} transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#005424] transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <span className="text-sm font-medium text-[#005424] group-hover:underline">
                      {option.actionText} →
                    </span>
                  </div>
                </div>
              );

              if (isExternal) {
                return (
                  <a
                    key={index}
                    href={option.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </a>
                );
              }

              if (isHash) {
                return <div key={index}>{content}</div>;
              }

              return (
                <a key={index} href={option.action} onClick={() => setOpen(false)}>
                  {content}
                </a>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Need immediate help?</strong> Check our FAQ section first for
              quick answers to common questions.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#005424] hover:bg-[#004020] font-semibold"
        >
          <HelpCircle className="mr-2 h-5 w-5" />
          Get Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#005424]" />
            Get Help & Support
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose how you'd like to get in touch or find answers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            const isExternal = option.external;
            const isHash = option.action.startsWith('#');

            const handleClick = () => {
              if (isHash) {
                setOpen(false);
                // Small delay to ensure dialog closes before scrolling
                setTimeout(() => {
                  const element = document.querySelector(option.action);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            };

            const content = (
              <div
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-[#005424] transition-all cursor-pointer group"
                onClick={handleClick}
              >
                <div className={`p-3 rounded-lg ${option.color} transition-colors`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#005424] transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <span className="text-sm font-medium text-[#005424] group-hover:underline">
                    {option.actionText} →
                  </span>
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={index}
                  href={option.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {content}
                </a>
              );
            }

            if (isHash) {
              return <div key={index}>{content}</div>;
            }

            return (
              <a key={index} href={option.action} onClick={() => setOpen(false)}>
                {content}
              </a>
            );
          })}
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Need immediate help?</strong> Check our FAQ section first for
            quick answers to common questions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
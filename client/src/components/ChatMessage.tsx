import { Card } from "@/components/ui/card";
import { shortenAddress } from "@/lib/web3";
import { type Message } from "@shared/schema";
import { format } from "date-fns";
import { Smile, PlusCircle } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  onReact?: (emoji: string) => void;
}

interface Reaction {
  emoji: string;
  count: number;
}

export default function ChatMessage({ message, isOwn, onReact }: ChatMessageProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    setShowPicker(false);
    if (onReact) {
      onReact(emoji.native);
    }
    // For now, just add locally. In the future, this should be synced with the server
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji.native);
      if (existing) {
        return prev.map(r => 
          r.emoji === emoji.native 
            ? { ...r, count: r.count + 1 }
            : r
        );
      }
      return [...prev, { emoji: emoji.native, count: 1 }];
    });
  };

  if (!message) return null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card className={`max-w-[80%] p-3 ${
        isOwn 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-800 text-gray-100'
      }`}>
        <div className="text-sm font-medium mb-1 opacity-90">
          {shortenAddress(message.fromAddress)}
        </div>
        <div className="break-words">{message.content}</div>
        <div className="text-xs mt-1 opacity-70">
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {reactions.map((reaction, index) => (
              <span key={index} className="bg-black/20 rounded px-1.5 py-0.5 text-sm">
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}

        {/* Reaction Button */}
        <div className="mt-2">
          <Popover open={showPicker} onOpenChange={setShowPicker}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                React
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none">
              <Picker 
                data={data} 
                onEmojiSelect={handleEmojiSelect}
                theme="dark"
                emojiSize={20}
                emojiButtonSize={28}
                maxFrequentRows={1}
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    </div>
  );
}
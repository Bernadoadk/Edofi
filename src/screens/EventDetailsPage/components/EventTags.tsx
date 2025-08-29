import React from 'react';
import { Tag } from 'lucide-react';

interface EventTagsProps {
  tags: string[];
}

export const EventTags: React.FC<EventTagsProps> = ({ tags }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary-color/20 rounded-lg flex items-center justify-center">
          <Tag className="w-5 h-5 text-secondary-color" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Catégories
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-color/20 text-secondary-color hover:bg-secondary-color/30 transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}; 
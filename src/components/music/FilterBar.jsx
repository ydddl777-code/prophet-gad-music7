import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

export default function FilterBar({ genres, onSearchChange, onGenreChange, onSortChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search tracks, artists, albums..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select onValueChange={onGenreChange} defaultValue="all">
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onSortChange} defaultValue="-created_date">
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-created_date">Newest First</SelectItem>
          <SelectItem value="created_date">Oldest First</SelectItem>
          <SelectItem value="title">Title A-Z</SelectItem>
          <SelectItem value="-title">Title Z-A</SelectItem>
          <SelectItem value="artist">Artist A-Z</SelectItem>
          <SelectItem value="-artist">Artist Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
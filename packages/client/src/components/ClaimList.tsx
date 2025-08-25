/**
 * Optimized ClaimList component with virtualization and memoization
 */

'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import { useVirtualScroll, useDebounce } from '@/lib/performance';
import type { Claim } from '@/types/claim';

interface ClaimListProps {
  claims: Claim[];
  onClaimSelect?: (claim: Claim) => void;
  onClaimEdit?: (claim: Claim) => void;
  onClaimDelete?: (claimId: string) => void;
}

// Memoized individual claim item to prevent unnecessary re-renders
const ClaimItem = memo<{
  claim: Claim;
  onSelect?: (claim: Claim) => void;
  onEdit?: (claim: Claim) => void;
  onDelete?: (claimId: string) => void;
}>(({ claim, onSelect, onEdit, onDelete }) => {
  const handleSelect = useCallback(() => {
    onSelect?.(claim);
  }, [claim, onSelect]);

  const handleEdit = useCallback(() => {
    onEdit?.(claim);
  }, [claim, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(claim.id);
  }, [claim.id, onDelete]);

  const statusColor = useMemo(() => {
    switch (claim.status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [claim.status]);

  const priorityColor = useMemo(() => {
    switch (claim.priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'normal': return 'border-l-blue-500';
      case 'low': return 'border-l-gray-500';
      default: return 'border-l-gray-500';
    }
  }, [claim.priority]);

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${priorityColor} hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            onClick={handleSelect}
          >
            {claim.claimNumber || `Claim ${claim.id.slice(0, 8)}`}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {claim.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Vehicle:</strong> {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}</p>
        <p><strong>Date of Loss:</strong> {new Date(claim.dateOfLoss).toLocaleDateString()}</p>
        {claim.location.address && (
          <p><strong>Location:</strong> {claim.location.address}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            Updated: {new Date(claim.updatedAt).toLocaleString()}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${claim.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
            claim.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
            claim.priority === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
            {claim.priority} priority
          </span>
        </div>
      </div>
    </div>
  );
});

ClaimItem.displayName = 'ClaimItem';

// Main ClaimList component with virtualization
export const ClaimList = memo<ClaimListProps>(({ claims, onClaimSelect, onClaimEdit, onClaimDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Claim['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dateOfLoss' | 'updatedAt' | 'priority'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered and sorted claims
  const filteredClaims = useMemo(() => {
    let filtered = claims;

    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(claim => 
        claim.claimNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        claim.vehicle.make.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        claim.vehicle.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        claim.location.address?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    // Sort claims
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'dateOfLoss':
          aValue = new Date(a.dateOfLoss);
          bValue = new Date(b.dateOfLoss);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [claims, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  // Virtual scrolling for large lists
  const containerHeight = 600; // Adjust based on your needs
  const itemHeight = 140; // Height of each claim item
  
  const virtualScroll = useVirtualScroll(filteredClaims, {
    itemHeight,
    containerHeight,
    overscan: 3,
  });

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as Claim['status'] | 'all');
  }, []);

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as 'dateOfLoss' | 'updatedAt' | 'priority');
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No claims found</div>
        <p className="text-gray-400 mt-2">Create your first claim to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updatedAt">Updated</option>
            <option value="dateOfLoss">Date of Loss</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredClaims.length} of {claims.length} claims
      </div>

      {/* Virtual scrolled list */}
      <div 
        className="relative border rounded-lg overflow-auto"
        style={{ height: containerHeight }}
        onScroll={virtualScroll.onScroll}
      >
        <div style={{ height: virtualScroll.totalHeight, position: 'relative' }}>
          <div 
            style={{ 
              transform: `translateY(${virtualScroll.offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {virtualScroll.visibleItems.map(({ item: claim, index }) => (
              <div 
                key={claim.id}
                style={{ 
                  height: itemHeight,
                  padding: '8px',
                  borderBottom: index < filteredClaims.length - 1 ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <ClaimItem
                  claim={claim}
                  onSelect={onClaimSelect}
                  onEdit={onClaimEdit}
                  onDelete={onClaimDelete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ClaimList.displayName = 'ClaimList';

export default ClaimList;
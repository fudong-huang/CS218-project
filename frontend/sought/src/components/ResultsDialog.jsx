import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Search, Filter, Clock, Tag, BarChart } from "lucide-react";

const ResultsDialog = ({ results, isOpen, onClose, onResubmit, requestTitle }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#f8f9fa] rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">
              Results for "{requestTitle || 'Request'}"
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onResubmit}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#f5f5f7] transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-[#4a4a4a]" />
            </Button>
            <button 
              onClick={onClose} 
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-[#f5f5f7] transition-colors"
            >
              <span className="text-[#4a4a4a]">✕</span>
            </button>
          </div>
        </div>

        {/* Results Content */}
        <div className="overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* Top Row - Score and Actions */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium
                            ${result.score >= 0.8 ? 'bg-green-100 text-green-800' :
                              result.score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                            <BarChart className="h-4 w-4 inline mr-1" />
                            {(result.score).toFixed(1)}% Match
                          </span>
                        </div>
                        {result.timestamp && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(result.timestamp)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => window.open(result.url, '_blank')}
                        className="bg-[#4B5563] hover:bg-[#6B7280] text-white rounded-xl font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Item
                      </Button>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column - Image if exists */}
                      {result.image_url && (
                        <div className="aspect-square w-full rounded-lg overflow-hidden">
                          <img 
                            src={result.image_url} 
                            alt="Result"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Right Column - Details */}
                      <div className="space-y-3">
                        {result.title && (
                          <h3 className="text-lg font-medium text-gray-900">
                            {result.title}
                          </h3>
                        )}
                        {result.price && (
                          <p className="text-lg font-bold text-gray-900">
                            ${result.price}
                          </p>
                        )}
                        {result.description && (
                          <p className="text-sm text-gray-600">
                            {result.description}
                          </p>
                        )}
                        {result.seller && (
                          <p className="text-sm text-gray-500">
                            Seller: {result.seller}
                          </p>
                        )}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500">No results found for this request yet. Try resubmitting the request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDialog;
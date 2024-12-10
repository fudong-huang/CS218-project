import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Bell, Settings, Upload } from 'lucide-react';
import ResultsDialog from './ResultsDialog';

const API_URL = import.meta.env.PROD 
  ? 'https://zavgymhiie.execute-api.us-west-1.amazonaws.com/dev'
  : '/api';

const RequestCard = ({ title, status, request_id, onResultsClick }) => (
  <Card 
    className="p-0 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
    onClick={() => onResultsClick(request_id)}
  >
    <CardContent className="p-0">
      <div className="p-6">
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${
          status === 'pending' 
            ? 'bg-yellow-100 text-yellow-700'
            : status === 'completed'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700' // For any other status
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            status === 'Pending'
              ? 'bg-yellow-500'
              : status === 'completed'
              ? 'bg-green-500'
              : 'bg-gray-500' // For any other status
          }`}></span>
          {status}
        </span>
      </div>
    </CardContent>
  </Card>
);
const CreateRequestDialog = ({onRequestSubmitted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [refreshPeriod, setRefreshPeriod] = useState('5'); // Default to 5 minutes
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const uid = localStorage.getItem('uid');
          const response = await fetch(`${API_URL}/user-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid,
              item_name: title,
              description,
              time_interval: parseInt(refreshPeriod),
              pic: image
            }),
          });
      
          const data = await response.json();
          if (response.ok) {
            setIsOpen(false);
            onRequestSubmitted(); // Call the callback here
            setTitle(''); // Reset form
            setDescription(''); // Reset form
            setImage(null); // Reset form
          }
        } catch (error) {
          console.error('Error submitting request:', error);
        }
      };

  
    if (!isOpen) {
      return (
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-[#4B5563] hover:bg-[#6B7280] text-white rounded-xl font-medium
                     transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Request
        </Button>
      );
    }
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];  // This will get the format you showed
            setImage(base64String); // Store directly without additional encoding
            setImagePreview(reader.result); // Keep the full URL for preview
            setFileName(file.name);
          };
          reader.readAsDataURL(file);
        }
      };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Create New Request</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title*</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
                placeholder="Enter request title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-3 py-2 rounded-xl bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d]"
                placeholder="Enter request description"
              />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Refresh Period</label>
                <select
                    value={refreshPeriod}
                    onChange={(e) => setRefreshPeriod(e.target.value)}
                    className="w-full h-11 px-3 py-2 rounded-xl bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d]"
                >
                    <option value="5">5 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">120 minutes</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image (Optional)</label>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-dashed border-2 h-24 flex flex-col items-center justify-center relative"
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    {imagePreview ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-contain p-2"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 truncate">
                        {fileName}
                        </div>
                    </div>
                    ) : (
                    <>
                        <Upload className="h-6 w-6 mb-2" />
                        <span className="text-sm">Click to upload</span>
                    </>
                    )}
                    <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    />
                </Button>
                </div>
            <div className="flex gap-2 mt-6">
              <Button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full bg-[#4B5563] hover:bg-[#6B7280] text-white rounded-xl"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const HomePage = () => {
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const location = useLocation();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const uid = location.state?.uid || localStorage.getItem('uid');
    const [showSearch, setShowSearch] = useState(false); 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResults, setSelectedResults] = useState([]);
    const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
    const handleResultsClick = async (requestId) => {
      try {
        setSelectedRequestId(requestId); 
        const response = await fetch(`/api/get-results?request_id=${requestId}&uid=${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        const data = await response.json();
        if (response.ok) {
          setSelectedResults(data);
          setIsResultsDialogOpen(true);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await fetch(`${API_URL}/user-request`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
      
            const data = await response.json();
            
            if (response.ok) {
              setRequests(data);
            }
          } catch (error) {
            console.error('Error fetching requests:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        if (uid) {
          fetchRequests();
        }
      }, [uid,refreshTrigger]);

    if (!uid) {
        return <Navigate to="/" replace />;
    }
    const filteredRequests = requests.filter(request => 
        request.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const handleResubmitRequest = async (requestId) => {
        try {
          const response = await fetch(`/api/resubmit-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              request_id: requestId,
              uid: uid
            })
          });
      
          if (response.ok) {
            // Refresh the results after resubmission
            handleResultsClick(requestId);
          }
        } catch (error) {
          console.error('Error resubmitting request:', error);
        }
      };


    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <nav className="w-full px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#6EA1FF] flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-white font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>S</span>
            </div>
            <span className="text-2xl font-semibold text-[#1a1a1a]">Sought</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="relative flex items-center">
                {showSearch && (
                <div className="absolute right-0 top-[-8px] animate-in fade-in duration-200">
                    <Input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 h-10 pr-10 rounded-full bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d]"
                    autoFocus
                    />
                    <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-transparent"
                    onClick={() => {
                        setSearchTerm('');
                        setShowSearch(false);
                    }}
                    >
                    ✕
                    </Button>
                </div>
                )}
                <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#f5f5f7] transition-colors"
                onClick={() => setShowSearch(!showSearch)}
                >
                <Search className="h-5 w-5 text-[#4a4a4a]" />
                </Button>
            </div>
            {[Bell, Settings].map((Icon, i) => (
                <Button
                key={i}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#f5f5f7] transition-colors"
                >
                <Icon className="h-5 w-5 text-[#4a4a4a]" />
                </Button>
            ))}
            </div>
        </div>
        </nav>
  
        <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium text-[#1a1a1a]">My Requests</h1>
            <CreateRequestDialog onRequestSubmitted={() => setRefreshTrigger(prev => prev + 1)} />
        </div>
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </Card>
                ))}
            </div>
            ) : filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map(request => (
                    <RequestCard 
                    key={request.request_id}
                    title={request.item_name}
                    status={request.status}
                    request_id={request.request_id}
                    onResultsClick={handleResultsClick}
                    />
                ))}
                </div>
            ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="filter blur-sm pointer-events-none mb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Requests Yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                Create your first request by clicking the "New Request" button above
                </p>
            </div>
            )}
            <ResultsDialog 
              results={selectedResults}
              isOpen={isResultsDialogOpen}
              onClose={() => {
                setIsResultsDialogOpen(false);
                setSelectedRequestId(null);  // Clear selected request when closing
              }}
              onResubmit={() => selectedRequestId && handleResubmitRequest(selectedRequestId)}
              requestTitle={filteredRequests.find(r => r.request_id === selectedRequestId)?.item_name}
            />
        </main>
      </div>
    );
  };
  
export default HomePage;
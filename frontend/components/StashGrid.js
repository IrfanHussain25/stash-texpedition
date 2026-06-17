'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Package, Tag, DollarSign, Mic, Camera, Layers, Clock, Trash2, ExternalLink, AlertTriangle, Store, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

function typeIcon(type) {
  switch (type) {
    case 'video': return <Mic size={14} className="text-zinc-400" />;
    case 'screenshot': return <Camera size={14} className="text-zinc-400" />;
    default: return <Layers size={14} className="text-zinc-400" />;
  }
}

function StashCard({ item, onDelete }) {
  const date = item.created_at
    ? new Date(item.created_at).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
    })
    : null;

  return (
    <div className="group relative flex flex-col rounded-xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden hover:border-zinc-600 transition-colors duration-200">

      {/* Absolute Delete Button */}
      <button
        onClick={() => onDelete(item.id)}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
        aria-label="Delete item"
      >
        <Trash2 size={14} />
      </button>

      {/* Image Area - Fixed height, object-contain to preserve aspect ratio properly */}
      {item.image_url ? (
        <div className="relative w-full h-48 bg-white/5 border-b border-zinc-800/80 p-3 flex items-center justify-center">
          <img
            src={item.image_url}
            alt={item.product_name || 'Item'}
            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm"
          />
        </div>
      ) : (
        <div className="relative w-full h-12 bg-zinc-800/20 border-b border-zinc-800/80 flex items-center px-4">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {typeIcon(item.type)}
            {item.type}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col p-4 flex-1">

        {/* Type & Date for images */}
        {item.image_url && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {item.type}
            </span>
            <span className="text-[10px] text-zinc-600">•</span>
            {date && <span className="text-[10px] text-zinc-500">{date}</span>}
          </div>
        )}

        {/* Title */}
        <h3 className="text-zinc-100 font-medium text-sm leading-snug line-clamp-2 mb-1">
          {item.product_name || <span className="text-zinc-500 italic">Unknown product</span>}
        </h3>

        {/* Brand */}
        {item.brand && (
          <p className="text-xs text-zinc-400 mb-2 font-medium tracking-wide">{item.brand}</p>
        )}

        {/* Minimalist Deals List */}
        {item.deals && Array.isArray(item.deals) && item.deals.length > 0 && (
          <div className="mt-auto flex flex-col gap-1.5 pt-3 border-t border-zinc-800/50">
            {[...item.deals]
              .sort((a, b) => {
                const getPrice = (d) => {
                  const p = d.extracted_price || parseFloat((d.price || '').toString().replace(/[^0-9.]/g, ''));
                  return isNaN(p) || p === 0 ? Infinity : p;
                };
                return getPrice(a) - getPrice(b);
              })
              .slice(0, 3)
              .map((deal, idx) => (
                <a
                  key={idx}
                  href={deal.product_link || deal.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group/deal"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {deal.source_icon ? (
                      <img src={deal.source_icon} className="w-3.5 h-3.5 rounded-sm grayscale group-hover/deal:grayscale-0 opacity-70 group-hover/deal:opacity-100 transition-all" alt="" />
                    ) : (
                      <Store size={12} className="text-zinc-500" />
                    )}
                    <span className="text-xs text-zinc-400 group-hover/deal:text-zinc-200 truncate transition-colors">
                      {deal.source || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-300">
                      {deal.price || deal.extracted_price || 'View'}
                    </span>
                    <ExternalLink size={10} className="text-zinc-600 group-hover/deal:text-zinc-400 opacity-0 group-hover/deal:opacity-100 transition-all" />
                  </div>
                </a>
              ))}
          </div>
        )}

        {/* Fallback for items with no deals but have price/brand */}
        {(item.brand || item.price != null) && (!item.deals || item.deals.length === 0) && (
          <div className="mt-auto pt-3 border-t border-zinc-800/50 flex justify-between items-center text-xs">
            {item.brand && <span className="text-zinc-400">{item.brand}</span>}
            {item.price != null && <span className="font-mono text-zinc-300">{isNaN(Number(item.price)) ? item.price : `$${Number(item.price).toFixed(2)}`}</span>}
          </div>
        )}

        {/* Date for non-image items */}
        {!item.image_url && date && (
          <div className="mt-auto pt-3 border-t border-zinc-800/50 text-[10px] text-zinc-600">
            {date}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StashGrid({ refreshSignal }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [collapsedSets, setCollapsedSets] = useState(new Set());

  const toggleSet = (setName) => {
    setCollapsedSets((prev) => {
      const next = new Set(prev);
      if (next.has(setName)) {
        next.delete(setName);
      } else {
        next.add(setName);
      }
      return next;
    });
  };

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('stash_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => {
    if (refreshSignal > 0) fetchItems();
  }, [refreshSignal, fetchItems]);

  useEffect(() => {
    const channel = supabase
      .channel('stash_items_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'stash_items' },
        (payload) => {
          setItems((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'stash_items' },
        (payload) => {
          setItems((prev) => prev.filter(item => item.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;
    setItemToDelete(null);

    const previousItems = [...items];
    setItems((prev) => prev.filter(item => item.id !== id));

    const { error } = await supabase
      .from('stash_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Deletion error:", error);
      setItems(previousItems);
      toast.error("Failed to delete item.");
    } else {
      toast.success("Item removed");
    }
  };

  let displayedItems = [];
  if (activeTab === 'recent') {
    displayedItems = items.slice(0, 5);
  } else {
    displayedItems = items.filter(item => activeTab === 'all' || item.type === activeTab);
  }

  const groupedItems = activeTab !== 'recent' ? displayedItems.reduce((acc, item) => {
    const set = item.item_set || 'Miscellaneous';
    if (!acc[set]) acc[set] = [];
    acc[set].push(item);
    return acc;
  }, {}) : {};

  const sortedSetNames = Object.keys(groupedItems).sort();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Minimalist Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-800/50 pb-3">
        <button
          onClick={() => setActiveTab('recent')}
          className={`text-sm pb-3 -mb-[13px] transition-colors border-b-2 ${activeTab === 'recent' ? 'text-zinc-100 border-zinc-100 font-medium' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          Recent
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`text-sm pb-3 -mb-[13px] transition-colors border-b-2 ${activeTab === 'all' ? 'text-zinc-100 border-zinc-100 font-medium' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('screenshot')}
          className={`text-sm pb-3 -mb-[13px] transition-colors border-b-2 ${activeTab === 'screenshot' ? 'text-zinc-100 border-zinc-100 font-medium' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          Screenshots
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`text-sm pb-3 -mb-[13px] transition-colors border-b-2 ${activeTab === 'video' ? 'text-zinc-100 border-zinc-100 font-medium' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          Videos
        </button>
      </div>

      {/* Grid Content */}
      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-zinc-600">
          <Layers size={32} strokeWidth={1} />
          <p className="text-sm font-medium text-zinc-500">No items found</p>
        </div>
      ) : activeTab === 'recent' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
          {displayedItems.map((item) => (
            <StashCard key={item.id} item={item} onDelete={(id) => setItemToDelete(id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {sortedSetNames.map((setName) => {
            const isCollapsed = collapsedSets.has(setName);
            const itemsInSet = groupedItems[setName];
            return (
              <div key={setName} className="flex flex-col gap-4">
                {/* Accordion Header */}
                <div 
                  className="flex items-center gap-3 cursor-pointer group select-none"
                  onClick={() => toggleSet(setName)}
                >
                  <h2 className="text-lg font-medium text-zinc-100 tracking-tight group-hover:text-purple-400 transition-colors">
                    {setName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 text-[10px] font-mono">
                    {itemsInSet.length}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-zinc-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} 
                  />
                  <div className="flex-1 h-px bg-zinc-800/40 ml-2" />
                </div>
                
                {/* Accordion Body */}
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                  {itemsInSet.map((item) => (
                    <StashCard key={item.id} item={item} onDelete={(id) => setItemToDelete(id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setItemToDelete(null)}></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-zinc-100 mb-1">
              <AlertTriangle size={18} className="text-red-400" />
              <h3 className="text-base font-medium">Delete Item</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this?
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 rounded-md text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

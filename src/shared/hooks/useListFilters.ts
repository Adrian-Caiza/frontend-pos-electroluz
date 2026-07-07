import { useState, useEffect, useMemo } from 'react';

export function useListFilters(initialPageSize: number = 20) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  
  useEffect(() => { 
    setPage(1); 
  }, [debouncedSearch, status]);

  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (status) params.set('status', status);
    return params.toString();
  }, [page, pageSize, debouncedSearch, status]);

  return { 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch, 
    status, 
    setStatus, 
    debouncedSearch,
    urlParams
  };
}
